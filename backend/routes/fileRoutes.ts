import { Router } from 'express';
import { uploadFile, downloadFile, decryptFile } from '../controllers/fileController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Protected routes
router.post('/upload', authMiddleware, uploadFile);
router.post('/download', authMiddleware, downloadFile);
router.post('/decrypt', authMiddleware, decryptFile);

export default router;
