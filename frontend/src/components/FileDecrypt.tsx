import React, { useState } from 'react';
import {AES} from 'crypto-js';

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
      console.error('Decryption failed:', error);
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
    <div className="file-decrypt">
      <h2>Decrypt File</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Paste Encrypted Data Here"
          value={encryptedData}
          onChange={handleEncryptedFileChange}
          rows={10}
        />
        <input
          type="text"
          placeholder="Enter Decryption Key"
          value={decryptionKey}
          onChange={handleDecryptionKeyChange}
        />
        <button type="submit">Decrypt File</button>
      </form>

      {decryptedFile && (
        <div>
          <h3>Decrypted File Content:</h3>
          <textarea value={decryptedFile} readOnly rows={10} />
        </div>
      )}
    </div>
  );
};

export default FileDecrypt;
