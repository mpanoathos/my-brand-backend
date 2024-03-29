import multer, { StorageEngine } from 'multer';
import { Request } from 'express';

const storage: StorageEngine = multer.diskStorage({
    filename: function (req: Request, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });
export default upload;
