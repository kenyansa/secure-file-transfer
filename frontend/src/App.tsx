import React, { useState } from 'react';
import axios from 'axios';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [downloadLink, setDownloadLink] = useState('');
  const [decryptData, setDecryptData] = useState({ encryptedFilePath: '', encryptedAESKey: '', privateKey: '' });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  // Handle user login
  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      setToken(response.data.token);
      alert('Login successful');
    } catch (error) {
      alert('Login failed');
      console.error(error);
    }
  };

  // Upload the file with JWT token
  const handleFileUpload = async () => {
    const formData = new FormData();
    if (file && token) {
      formData.append('file', file);

      try {
        const response = await axios.post('http://localhost:5000/api/files/upload', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDownloadLink(response.data.encryptedFilePath);
        setDecryptData({
          encryptedFilePath: response.data.encryptedFilePath,
          encryptedAESKey: response.data.encryptedAESKey,
          privateKey: response.data.publicKey,
        });
        alert('File uploaded and encrypted');
      } catch (error) {
        console.error('File upload failed', error);
      }
    } else {
      alert('Please log in first');
    }
  };

  // Handle file decryption
  const handleFileDecrypt = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/files/decrypt', decryptData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(`File decrypted: ${response.data.decryptedFilePath}`);
    } catch (error) {
      console.error('Decryption failed', error);
    }
  };

  return (
    <div>
      <h1>Secure File Transfer</h1>

      <h2>Login</h2>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>

      <h2>File Upload</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload and Encrypt File</button>

      {downloadLink && (
        <div>
          <p>Encrypted file available for download:</p>
          <a href={`http://localhost:5000/uploads/${downloadLink}`} download>
            Download Encrypted File
          </a>
          <br />
          <button onClick={handleFileDecrypt}>Decrypt File</button>
        </div>
      )}
    </div>
  );
};

export default App;
