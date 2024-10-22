import React, { useState } from 'react';
import { AES } from 'crypto-js';

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [encryptionKey, setEncryptionKey] = useState<string>('');
  const [encryptedFile, setEncryptedFile] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
  };

  const handleEncryptionKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEncryptionKey(e.target.value);
  };

  const encryptFile = async (file: File) => {
    const reader = new FileReader();

    reader.onload = () => {
      const fileContent = reader.result as string;
      const encrypted = AES.encrypt(fileContent, encryptionKey).toString();
      setEncryptedFile(encrypted);
      // You can now send the encrypted file to the server
      uploadEncryptedFile(encrypted);
    };

    reader.readAsDataURL(file);
  };

  const uploadEncryptedFile = async (encryptedContent: string) => {
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ encryptedContent }),
      });

      const result = await response.json();
      console.log(result);
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload the file.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file && encryptionKey) {
      encryptFile(file);
    } else {
      alert('Please select a file and provide an encryption key.');
    }
  };

  return (
    <div className="file-upload">
      <h2>Upload and Encrypt File</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <input
          type="text"
          placeholder="Enter Encryption Key"
          value={encryptionKey}
          onChange={handleEncryptionKeyChange}
        />
        <button type="submit">Upload and Encrypt</button>
      </form>

      {encryptedFile && (
        <div>
          <h3>Encrypted File:</h3>
          <textarea value={encryptedFile} readOnly rows={10} />
        </div>
      )}
    </div>
  );
};

export default FileUpload;
