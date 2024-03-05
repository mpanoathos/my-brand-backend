import dotenv from 'dotenv'
dotenv.config();

import express, { Request, Response, Router, NextFunction } from 'express';
import Post, { PostDocument } from '../models/Post.js'; 
import User from '../models/User.js'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


// const adminLayout = '../views/layout/admin';
const jwtSecret = process.env.JWT_SECRET as string;


import { userSchema, postSchema } from '../helpers/validationScheme.js';

const router: Router = express.Router();

interface AuthRequest extends Request {
  userId?: string;
}
// Check Login
const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.cookies.token;
  
  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
  } else {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
      req.userId = decoded.userId;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Unauthorized' });
    }
  }
};
// POST Admin-Check-Login Page
router.post('/users/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    const validation = userSchema.validate(req.body);

    if (validation.error) {
      return res.status(400).json({ message: validation.error.details[0].message });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret);

    res.cookie('token', token, { httpOnly: true });
    res.json({ message: 'Valid Credentials' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//Register users
router.post('/users/register', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({ username, password: hashedPassword });
      res.status(201).json({ message: 'User Created', user });
    } catch (error:any) {
      if (error.code === 11000) {
        res.status(409).json({ message: 'User already in use' });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all Users
router.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await User.find();

    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update User by ID
router.put('/users/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const { email, password, otherUpdatedFields } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    user.email = email || user.email;
    user.password = password ? await bcrypt.hash(password, 10) : user.password; // Hash the new password if provided
    // Update other fields as needed

    // Save the updated user
    await user.save();

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Like a post
router.post('/blogs/:id/like', authMiddleware, async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const post: PostDocument | null = await Post.findByIdAndUpdate(postId, { $inc: { likes: 1 } }, { new: true });

    if (post) {
      res.send({ data: post });
    } else {
      res.status(404).send('Post not found');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});
// Get Likes for a Post
router.get('/blogs/:id/likes', async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    
    // Retrieve the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Retrieve and send the like count for the post
    const likes = post.likes || 0; // Assuming likes property exists on the post schema
    res.json({ likes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Comment on a post
router.post('/blogs/:id/comment', authMiddleware, async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const { commentText } = req.body;
    const post: PostDocument | null = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: { text: commentText } } },
      { new: true }
    );

    if (post) {
      res.json({ data: post });
    } else {
      res.status(404).send('Post not found');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

// Get Comments for a Post
router.get('/blogs/:id/comments', async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    
    // Retrieve the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Retrieve and send the comments for the post
    const comments = post.comments || [];
    res.json({ comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


//Create new Post
router.post('/blogs/post', authMiddleware, async (req: Request, res: Response) => {
  try {
    try {
      const newPost = new Post({
        title: req.body.title,
        body: req.body.body,
      });

      const validationPost = postSchema.validate(newPost);

      if (validationPost.error) {
        return res.status(400).json({ message: validationPost.error.details[0].message });
      }

      await Post.create(newPost);
      res.json(newPost);
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
});

// Update Post Page
router.put('/blogs/post/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { title, body } = req.body;

    if (!title || !body) {
      return res.status(400).json({ error: 'Title and body are required fields' });
    }

    const updatedPost: PostDocument | null = await Post.findByIdAndUpdate(req.params.id, {
      title,
      body,
      updatedAt: Date.now(),
    });

    if (updatedPost) {
      res.json(updatedPost);
    } else {
      res.status(404).send('Post not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE
router.delete('/blogs/post/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const deletedPost = await Post.deleteOne({ _id: req.params.id });
    res.json(deletedPost);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
