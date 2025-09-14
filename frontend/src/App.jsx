import { useState } from 'react'
import './App.css'

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setResult(null);
    setError(null);
  };

  // Convert file to base64
  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Remove the data:mime/type;base64, part
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const base64Image = await toBase64(selectedFile);
      const mimeType = selectedFile.type;
      console.log({ base64Image, mimeType });
      const response = await fetch('http://localhost:3000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Image, mimeType })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error analyzing image');
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: 480,
      margin: '48px auto',
      padding: 32,
      background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
      borderRadius: 16,
      boxShadow: '0 4px 24px rgba(44, 62, 80, 0.12)',
      fontFamily: 'Segoe UI, Arial, sans-serif',
      color: '#2c3e50',
    }}>
      <h1 style={{ textAlign: 'center', fontWeight: 700, fontSize: 32, marginBottom: 8, letterSpacing: 1 }}>Skin Condition Analyzer</h1>
      <p style={{ textAlign: 'center', color: '#34495e', marginBottom: 24 }}>
        Upload a clear image of your skin concern to get an instant AI-powered analysis.
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{
            padding: '8px 0',
            borderRadius: 8,
            border: '1px solid #b2bec3',
            background: '#fff',
            width: '100%',
            fontSize: 16,
          }}
        />
        <button
          type="submit"
          disabled={!selectedFile || loading}
          style={{
            background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '12px 32px',
            fontWeight: 600,
            fontSize: 18,
            cursor: !selectedFile || loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 8px #b2bec3',
            transition: 'background 0.2s',
          }}
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>
      {error && <p style={{ color: '#e74c3c', marginTop: 16, textAlign: 'center' }}>{error}</p>}
      {result && (
        <div style={{
          marginTop: 32,
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 2px 8px #dfe6e9',
          padding: 24,
        }}>
          <h2 style={{ color: '#185a9d', fontWeight: 700, fontSize: 24, marginBottom: 12 }}>Result</h2>
          <p><strong>Condition:</strong> <span style={{ color: '#43cea2', fontWeight: 600 }}>{result.conditionName}</span></p>
          <p><strong>Description:</strong> {result.description}</p>
          <p><strong>Symptoms:</strong></p>
          <ul style={{ marginLeft: 20, marginBottom: 12 }}>
            {result.symptoms.map((s, i) => <li key={i} style={{ marginBottom: 4 }}>{s}</li>)}
          </ul>
          <p><strong>Suggestions:</strong></p>
          <ul style={{ marginLeft: 20 }}>
            {result.suggestions.map((s, i) => <li key={i} style={{ marginBottom: 4 }}>{s}</li>)}
          </ul>
        </div>
      )}
      <footer style={{ marginTop: 32, textAlign: 'center', color: '#b2bec3', fontSize: 14 }}>
        <span>Powered by AI | Not medical advice</span>
      </footer>
    </div>
  );
}

export default App
