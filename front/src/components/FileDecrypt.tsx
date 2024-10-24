import React, { useState } from 'react';
import { AES } from 'crypto-js';

const FileDecrypt: React.FC = () => {
  const [encryptedData, setEncryptedData] = useState<string>('');
  const [decryptionKey, setDecryptionKey] = useState<string>('');
  const [decryptedFile, setDecryptedFile] = useState<string | null>(null);

  const handleDecryptionKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDecryptionKey(e.target.value);
  };

  const handleEncryptedFileChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEncryptedData(e.target.value);
  };

  const decryptFile = () => {
    try {
      const bytes = AES.decrypt(encryptedData, decryptionKey);
      const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

      if (!decryptedText) {
        throw new Error('Invalid decryption key');
      }

      setDecryptedFile(decryptedText);
    } catch (error) {
        console.error('Decryption error:', error); 
      alert('Failed to decrypt the file. Please check your key.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (encryptedData && decryptionKey) {
      decryptFile();
    } else {
      alert('Please provide encrypted data and a decryption key.');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">Decrypt File</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          placeholder="Paste Encrypted Data Here"
          value={encryptedData}
          onChange={handleEncryptedFileChange}
          rows={10}
          className="block w-full p-3 text-sm text-gray-500 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Enter Decryption Key"
          value={decryptionKey}
          onChange={handleDecryptionKeyChange}
          className="block w-full text-sm text-gray-500 border border-gray-300 rounded p-2"
        />
        <button 
          type="submit" 
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors">
          Decrypt File
        </button>
      </form>

      {decryptedFile && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Decrypted File Content:</h3>
          <textarea 
            value={decryptedFile} 
            readOnly 
            rows={10} 
            className="w-full p-3 border border-gray-300 rounded bg-gray-100 text-sm"
          />
        </div>
      )}
    </div>
  );
};

export default FileDecrypt;
