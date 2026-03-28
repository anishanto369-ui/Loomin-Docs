import React, { useState, useEffect } from 'react';

export default function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState('llama3');
  const [tokens, setTokens] = useState(0);
  const [files, setFiles] = useState([
    { id: 1, name: 'Q3_Financial_Architecture.pdf', size: '2.4 MB' },
    { id: 2, name: 'Server_Passwords_List.txt', size: '12 KB' }
  ]);

  useEffect(() => {
    setTokens(Math.ceil(input.length / 4));
  }, [input]);

  const contextPercentage = Math.min(100, ((tokens / 8192) * 100)).toFixed(1);

  const handleAction = async (actionType: string) => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, model: model }),
      });
      const data = await response.json();
      setOutput(`[${data.model_used.toUpperCase()} - ${actionType}]:\n\n${data.response}`);
    } catch (error) {
      setOutput('Error: Connection failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '20px' }}>
        <h1>Loomin-Docs v2.0 <span style={{ fontSize: '12px', color: '#64748b' }}>ENTERPRISE</span></h1>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <span>Context: <b style={{ color: '#22c55e' }}>{contextPercentage}%</b></span>
          <select value={model} onChange={(e) => setModel(e.target.value)} style={{ backgroundColor: '#1e293b', color: 'white' }}>
            <option value="llama3">Llama 3 (8B)</option>
            <option value="mistral">Mistral (7B)</option>
          </select>
        </div>
      </header>

      <div style={{ margin: '20px 0', display: 'flex', gap: '10px' }}>
        <button onClick={() => handleAction('Summarized')} style={{ backgroundColor: '#3b82f6', color: 'white', padding: '10px' }}>Summarize</button>
        <button onClick={() => handleAction('Improved')} style={{ backgroundColor: '#8b5cf6', color: 'white', padding: '10px' }}>Improve Writing</button>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} style={{ width: '50%', height: '400px', backgroundColor: '#1e293b', color: 'white' }} />
        <textarea value={output} readOnly style={{ width: '50%', height: '400px', backgroundColor: '#020617', color: '#94a3b8' }} />
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#1e293b' }}>
        <h3 style={{ fontSize: '14px', color: '#94a3b8' }}>Asset Management</h3>
        {files.map(f => (
          <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#0f172a', marginBottom: '5px' }}>
            <span>📄 {f.name}</span>
            <button onClick={() => setFiles(files.filter(file => file.id !== f.id))} style={{ backgroundColor: '#ef4444', color: 'white' }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}