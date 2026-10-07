import { useState, useEffect } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [authMode, setAuthMode] = useState('login') // 'login' or 'register'

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [file, setFile] = useState(null)
  const [uploadStatus, setUploadStatus] = useState('')

  // Keep localStorage in sync whenever token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }, [token])

  const handleAuth = async () => {
    setAuthError('')
    const endpoint = authMode === 'login' ? '/login' : '/register'

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })

    const data = await response.json()

    if (data.error) {
      setAuthError(data.error)
      return
    }

    if (authMode === 'register') {
      setAuthError('Registered successfully. Please log in.')
      setAuthMode('login')
    } else {
      setToken(data.access_token)
    }
  }

  const logout = () => {
    setToken('')
    setMessages([])
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')

    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message: input })
    })

    if (response.status === 401) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Session expired. Please log in again.' }])
      setToken('')
      return
    }

    const data = await response.json()
    const aiMessage = { role: 'assistant', content: data.reply }
    setMessages((prev) => [...prev, aiMessage])
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
    setUploadStatus('')
  }

  const uploadFile = async () => {
    if (!file) return
    setUploadStatus('Uploading...')

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })

    const data = await response.json()
    setUploadStatus(data.message || data.error)
  }

  // If not logged in, show the Login/Register form
  if (!token) {
    return (
      <div className="auth-container">
        <h2>{authMode === 'login' ? 'Login' : 'Register'}</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleAuth}>
          {authMode === 'login' ? 'Login' : 'Register'}
        </button>

        {authError && <p className="auth-error">{authError}</p>}

        <p className="auth-switch" onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>
          {authMode === 'login' ? "Don't have an account? Register" : 'Already have an account? Login'}
        </p>
      </div>
    )
  }

  // If logged in, show the chat UI
  return (
    <div className="chat-container">
      <div className="header-row">
        <h2>AI Knowledge Assistant</h2>
        <button onClick={logout}>Logout</button>
      </div>

      <div className="upload-row">
        <input type="file" accept=".pdf" onChange={handleFileChange} />
        <button onClick={uploadFile}>Upload PDF</button>
      </div>
      {uploadStatus && <p className="upload-status">{uploadStatus}</p>}

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={msg.role === 'user' ? 'user-msg' : 'ai-msg'}>
            <b>{msg.role === 'user' ? 'You' : 'AI'}:</b> {msg.content}
          </div>
        ))}
      </div>

      <div className="input-row">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  )
}

export default App