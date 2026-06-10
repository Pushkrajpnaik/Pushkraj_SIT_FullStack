import React, { useState } from 'react';
import { 
  Send, 
  AlertCircle, 
  Terminal, 
  Info, 
  RefreshCcw, 
  LayoutDashboard,
  Copy,
  Check
} from 'lucide-react';
import SummaryStats from './components/SummaryStats';
import TreeView from './components/TreeView';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [input, setInput] = useState('A->B, A->C, B->D, X->Y, Y->Z, Z->X');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Clean input: split by comma or newline
    const edges = input
      .split(/[,\n]/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    try {
      const res = await fetch(`${API_URL}/api/graph`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ edges })
      });

      if (!res.ok) throw new Error('API request failed');
      
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(response, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">GraphInsight</h1>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-sm font-medium text-gray-500">
            <span>{response?.user_id || 'Architect Review'}</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <LayoutDashboard className="w-5 h-5 text-primary-600" />
                <h2 className="text-lg font-bold">Input Edges</h2>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter edges (e.g. A-&gt;B)
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full h-48 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all font-mono text-sm bg-gray-50"
                    placeholder="A-&gt;B&#10;A-&gt;C&#10;B-&gt;D"
                  />
                  <p className="mt-2 text-xs text-gray-500 italic">
                    Use commas or new lines to separate edges.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <RefreshCcw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                  {loading ? 'Processing...' : 'Generate Insights'}
                </button>
              </form>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 text-red-700 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}
            </div>

            {/* Identity Info */}
            <div className="mt-6 p-6 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl text-white shadow-lg shadow-primary-200">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Developer Identity
              </h3>
              <div className="space-y-2 text-sm opacity-90">
                <p><span className="font-semibold">ID:</span> {response?.user_id || 'pushkrajnaik_20051130'}</p>
                <p><span className="font-semibold">Email:</span> {response?.email_id || 'pushkraj.naik.btech2023@sitpune.edu.in'}</p>
                <p><span className="font-semibold">Enrollment:</span> {response?.enrollment_number || '23070122169'}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-7">
            {!response && !loading && (
              <div className="h-full flex flex-col items-center justify-center py-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400">
                <Terminal className="w-12 h-12 mb-4 opacity-20" />
                <p>Submit edges to see hierarchical visualization</p>
              </div>
            )}

            {response && (
              <div>
                <SummaryStats summary={response.summary} />

                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">Hierarchies</h3>
                  <button 
                    onClick={handleCopy}
                    className="flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-primary-600 transition-colors"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied JSON' : 'Copy API Response'}
                  </button>
                </div>

                <div className="space-y-4">
                  {response.hierarchies.map((h, idx) => (
                    <TreeView key={idx} hierarchy={h} />
                  ))}
                </div>

                {/* Validation Logs */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <h4 className="text-sm font-bold text-red-600 mb-2">Invalid Entries</h4>
                    <div className="flex flex-wrap gap-2">
                      {response.invalid_entries.length > 0 ? (
                        response.invalid_entries.map((entry, i) => (
                          <span key={i} className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded border border-red-100">
                            {entry}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">None</span>
                      )}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <h4 className="text-sm font-bold text-amber-600 mb-2">Duplicate Edges</h4>
                    <div className="flex flex-wrap gap-2">
                      {response.duplicate_edges.length > 0 ? (
                        response.duplicate_edges.map((entry, i) => (
                          <span key={i} className="px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded border border-amber-100">
                            {entry}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">None</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
