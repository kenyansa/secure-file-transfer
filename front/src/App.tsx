import React, { useState } from 'react';
import axios from 'axios';
import './index.css';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [downloadLink, setDownloadLink] = useState('');
  const [decryptData, setDecryptData] = useState({ encryptedFilePath: '', encryptedAESKey: '', privateKey: '' });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Secure File Transfer</h1>

        {/* Login Section */}
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Login
        </button>

        {/* File Upload Section */}
        <h2 className="text-xl font-semibold mt-6 mb-4">File Upload</h2>
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleFileUpload}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition duration-200"
        >
          Upload and Encrypt File
        </button>

        {/* Download and Decrypt Section */}
        {downloadLink && (
          <div className="mt-6">
            <p className="mb-2 text-gray-700">Encrypted file available for download:</p>
            <a
              href={`http://localhost:5000/uploads/${downloadLink}`}
              download
              className="text-blue-500 underline hover:text-blue-700"
            >
              Download Encrypted File
            </a>
            <br />
            <button
              onClick={handleFileDecrypt}
              className="mt-4 w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition duration-200"
            >
              Decrypt File
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
