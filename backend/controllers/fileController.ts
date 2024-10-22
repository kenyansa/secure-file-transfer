import { Request, Response } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import NodeRSA from 'node-rsa';
import fs from 'fs';
import path from 'path';

// Configuring file upload with multer
const upload = multer({ dest: 'uploads/' });

// Generate RSA keys
const key = new NodeRSA({ b: 2048 });
const publicKey = key.exportKey('public');
const privateKey = key.exportKey('private');

// AES encryption function
const aesEncrypt = (fileData: Buffer, aesKey: string) => {
  const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, Buffer.alloc(16, 0));
  const encryptedData = Buffer.concat([cipher.update(fileData), cipher.final()]);
  return encryptedData;
};

// AES decryption function
const aesDecrypt = (encryptedData: Buffer, aesKey: string) => {
  const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, Buffer.alloc(16, 0));
  const decryptedData = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
  return decryptedData;
};

// POST /api/files/upload
export const uploadFile = (req: Request, res: Response) => {
  upload.single('file')(req, res, () => {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    const filePath = req.file.path;
    const fileData = fs.readFileSync(filePath);
    const aesKey = crypto.randomBytes(32); // Generate AES key

    // Encrypt the file using AES
    const encryptedFile = aesEncrypt(fileData, aesKey.toString('hex'));

    // Encrypt the AES key using RSA
    const encryptedAESKey = key.encrypt(aesKey.toString('hex'), 'base64');

    // Save the encrypted file to disk
    const encryptedFilePath = `encrypted_${req.file.originalname}`;
    fs.writeFileSync(path.join('uploads', encryptedFilePath), encryptedFile);

    res.status(200).json({
      message: 'File uploaded and encrypted successfully',
      encryptedFilePath,
      encryptedAESKey,
      publicKey,
    });
  });
};

// POST /api/files/download
export const downloadFile = (req: Request, res: Response) => {
  const { encryptedFilePath } = req.body;

  const fileLocation = path.join('uploads', encryptedFilePath);
  if (fs.existsSync(fileLocation)) {
    res.download(fileLocation);
  } else {
    res.status(404).send('File not found');
  }
};

// POST /api/files/decrypt
export const decryptFile = (req: Request, res: Response) => {
  const { encryptedFilePath, encryptedAESKey, privateKey } = req.body;

  // Decrypt the AES key using the provided RSA private key
  const decryptedAESKey = key.decrypt(encryptedAESKey, 'utf8');

  // Read the encrypted file
  const encryptedFile = fs.readFileSync(path.join('uploads', encryptedFilePath));

  // Decrypt the file using the decrypted AES key
  const decryptedFile = aesDecrypt(encryptedFile, decryptedAESKey);

  // Save the decrypted file
  const decryptedFilePath = `decrypted_${encryptedFilePath}`;
  fs.writeFileSync(path.join('uploads', decryptedFilePath), decryptedFile);

  res.status(200).json({
    message: 'File decrypted successfully',
    decryptedFilePath,
  });
};
