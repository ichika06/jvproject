"use client"

import { useEffect, useRef, useState } from "react"
import { getFirestore, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { initializeApp } from "firebase/app"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

let firebaseApp
if (typeof window !== "undefined" && !globalThis._firebaseApp) {
  firebaseApp = initializeApp(firebaseConfig)
  globalThis._firebaseApp = firebaseApp
} else if (typeof window !== "undefined") {
  firebaseApp = globalThis._firebaseApp
}

const db = typeof window !== "undefined" ? getFirestore(firebaseApp) : null
const auth = typeof window !== "undefined" ? getAuth(firebaseApp) : null

export default function ChatBox({ chatId, user }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (!chatId || !db) return
    const q = query(collection(db, "chats", chatId, "messages"), orderBy("createdAt"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    })
    return () => unsubscribe()
  }, [chatId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim()) return
    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: input,
      sender: user?.uid || "anonymous",
      senderName: user?.name || "User",
      createdAt: serverTimestamp(),
    })
    setInput("")
  }

  return (
    <div className="flex flex-col h-80 border rounded-lg bg-background">
      <div className="flex-1 overflow-y-auto p-2">
        {messages.map(msg => (
          <div key={msg.id} className={`mb-2 ${msg.sender === user?.uid ? "text-right" : "text-left"}`}>
            <span className="font-semibold text-xs text-muted-foreground">{msg.senderName || "User"}</span>
            <div className={`inline-block px-3 py-1 rounded-lg ${msg.sender === user?.uid ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{msg.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="flex border-t">
        <input
          className="flex-1 px-2 py-1 outline-none bg-transparent"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit" className="px-4 py-1 bg-primary text-primary-foreground rounded-r-lg">Send</button>
      </form>
    </div>
  )
}
