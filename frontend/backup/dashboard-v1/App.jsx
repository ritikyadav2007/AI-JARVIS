import { useState } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [backendStatus, setBackendStatus] = useState('Checking')
  const [activePage, setActivePage] = useState('Assistant')

  async function checkBackend() {
    try {
      const response = await fetch('http://127.0.0.1:8000/health')
      setBackendStatus(response.ok ? 'Online' : 'Offline')
    } catch {
      setBackendStatus('Offline')
    }
  }

  async function sendMessage(event) {
    event.preventDefault()

    const text = message.trim()
    if (!text || loading) return

    setMessages(prev => [...prev, { role: 'user', text }])
    setMessage('')
    setLoading(true)

    try {
      const response = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'JARVIS request failed')
      }

      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: data.response }
      ])
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: `Connection error: ${error.message}` }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">J</div>
          <div>
            <h2>JARVIS</h2>
            <span>PERSONAL AI</span>
          </div>
        </div>

        <button className="new-chat" onClick={() => setMessages([])}>
          <span>＋</span> New conversation
        </button>

        <div className="nav-label">WORKSPACE</div>

        {[
          ['◈', 'Assistant'],
          ['◷', 'History'],
          ['⌘', 'Automation'],
          ['▤', 'My Files']
        ].map(([icon, name]) => (
          <button
            key={name}
            className={`nav-item ${activePage === name ? 'active' : ''}`}
            onClick={() => setActivePage(name)}
          >
            <span>{icon}</span>{name}
          </button>
        ))}

        <div className="sidebar-bottom">
          <div className="profile-card">
            <div className="avatar">RY</div>
            <div>
              <strong>Ritik Yadav</strong>
              <span>Personal Workspace</span>
            </div>
            <span className="profile-menu">•••</span>
          </div>
        </div>
      </aside>

      <main className="main-content">

        <header className="topbar">
          <div>
            <span className="breadcrumb">Workspace /</span>
            <strong>{activePage}</strong>
          </div>

          <div className="topbar-right">
            <div className={`connection ${backendStatus === 'Online' ? 'connected' : ''}`}>
              <span className="status-dot"></span>
              Backend {backendStatus}
            </div>
            <button className="icon-button" onClick={checkBackend} title="Check backend">
              ↻
            </button>
            <div className="top-avatar">RY</div>
          </div>
        </header>

        <section className="dashboard">

          <div className="welcome-section">
            <div className="eyebrow">
              <span className="eyebrow-dot"></span>
              YOUR INTELLIGENT ASSISTANT
            </div>

            <h1>
              Good day, Ritik <span className="wave">✦</span>
            </h1>

            <p>I'm JARVIS. What would you like me to help you with today?</p>
          </div>

          <div className="assistant-card">

            <div className="assistant-status">
              <span className="live-indicator"></span>
              JARVIS IS READY
            </div>

            <div className="orb-container">
              <div className="orb-ring ring-one"></div>
              <div className="orb-ring ring-two"></div>
              <div className="orb">
                <div className="orb-core"></div>
              </div>
            </div>

            <h2>Your AI, always ready.</h2>
            <p>Ask anything. Let's make things happen.</p>

            <div className="voice-hint">
              <span className="voice-line"></span>
              <span className="voice-line"></span>
              <span className="voice-line"></span>
              <span className="voice-line"></span>
              <span className="voice-line"></span>
              <span className="voice-line"></span>
              <span className="voice-line"></span>
            </div>

            <span className="voice-caption">
              Voice assistant is available in the local backend
            </span>
          </div>

          <div className="chat-section">

            <div className="section-heading">
              <div>
                <h3>Conversation</h3>
                <p>Chat with your personal AI assistant</p>
              </div>
              <button className="clear-button" onClick={() => setMessages([])}>
                Clear chat
              </button>
            </div>

            <div className="chat-messages">
              {messages.length === 0 ? (
                <div className="empty-chat">
                  <div className="empty-icon">✧</div>
                  <strong>Your conversation starts here</strong>
                  <span>Send a message to JARVIS to get started.</span>
                </div>
              ) : (
                messages.map((item, index) => (
                  <div className={`message ${item.role}`} key={index}>
                    <div className="message-avatar">
                      {item.role === 'user' ? 'RY' : 'J'}
                    </div>
                    <div className="message-content">
                      <strong>{item.role === 'user' ? 'You' : 'JARVIS'}</strong>
                      <p>{item.text}</p>
                    </div>
                  </div>
                ))
              )}

              {loading && (
                <div className="thinking">JARVIS is thinking...</div>
              )}
            </div>

            <form className="chat-input" onSubmit={sendMessage}>
              <input
                value={message}
                onChange={event => setMessage(event.target.value)}
                placeholder="Message JARVIS... Ask me anything"
                disabled={loading}
              />
              <button type="submit" disabled={loading || !message.trim()}>
                ↑
              </button>
            </form>

            <div className="input-footer">
              <span>✧ Powered by Gemini AI</span>
              <span>JARVIS can make mistakes. Verify important information.</span>
            </div>

          </div>

          <footer className="dashboard-footer">
            <span>JARVIS AI · PERSONAL ASSISTANT</span>
            <span>Designed for Ritik Yadav</span>
          </footer>

        </section>
      </main>
    </div>
  )
}

export default App
