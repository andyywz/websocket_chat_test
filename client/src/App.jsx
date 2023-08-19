import { useEffect, useState } from 'react'
import './App.css'

const websocket = new WebSocket('ws://localhost:3000/cable')

function App() {
  const [messages, setMessages] = useState([])
  const [guid, setGuid] = useState('')

  websocket.onopen = () => {
    console.log('Connected to websocket server')
    setGuid(Math.random().toString(36).substring(2, 15))

    websocket.send(
      JSON.stringify({
        command: 'subscribe',
        identifier: JSON.stringify({
          id: guid,
          channel: 'MessagesChannel'
        })
      })
    )
  }

  websocket.onmessage = (e) => {
    const data = JSON.parse(e.data)
    if (data.type === "ping") return
    if (data.type === 'welcome') return
    if (data.type === 'confirm_subscription') return

    const message = data.message
    setMessages([...messages, message])
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    const res = await fetch('http://localhost:3000/messages')
    const data = await res.json()
    setMessages(data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const body = e.target.message.value;
    e.target.message.value = ""

    await fetch('http://localhost:3000/messages', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ body })
    })
  }

  return (
    <div className="App">
      <div className="messageHeader">
        <h1>Messages</h1>
        <p>Guid: {guid}</p>
      </div>

      <button onClick={fetchMessages}>fetch</button>

      <div id="messages">
        {messages.map(msg => (
          <div className="message" key={msg.id}>
            <p>{msg.body}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input type="text" name="message" />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}

export default App
