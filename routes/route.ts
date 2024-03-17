import express, { Router, Request, Response } from 'express';
import Post, { PostDocument } from '../models/Post'; 
const router: Router = express.Router();

router.get('/blogs', async (req: Request, res: Response) => {
  try {
    const data: PostDocument[] = await Post.find();
    res.send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/blogs/:id', async (req: Request, res: Response) => {
  try {
    const slug: string = req.params.id;
    const data: PostDocument | null = await Post.findById(slug);
    
    if (!data) {
      res.status(404).send('Blog not found');
    } else {
      res.send(data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
