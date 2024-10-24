import React, { useState } from 'react';
import { AES} from 'crypto-js';

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
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">Upload and Encrypt File</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="file" 
          onChange={handleFileChange} 
          className="block w-full text-sm text-gray-500 border border-gray-300 rounded p-2"
        />
        <input
          type="text"
          placeholder="Enter Encryption Key"
          value={encryptionKey}
          onChange={handleEncryptionKeyChange}
          className="block w-full text-sm text-gray-500 border border-gray-300 rounded p-2"
        />
        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors">
          Upload and Encrypt
        </button>
      </form>

      {encryptedFile && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Encrypted File:</h3>
          <textarea 
            value={encryptedFile} 
            readOnly 
            rows={10} 
            className="w-full p-3 border border-gray-300 rounded bg-gray-100 text-sm"
          />
        </div>
      )}
    </div>
  );
};

export default FileUpload;
