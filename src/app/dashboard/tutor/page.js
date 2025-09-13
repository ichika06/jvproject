"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Settings } from "lucide-react"
import ChatBox from "@/components/ui/ChatBox"

export default function TutorDashboard() {
  const [userName, setUserName] = useState("")
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userInfo = localStorage.getItem("userInfo")
      if (userInfo) {
        const parsed = JSON.parse(userInfo)
        setUserName(parsed.firstName + " " + parsed.lastName)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="font-bold text-xl text-primary">TutorConnect</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>{userName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back, {userName}!</h2>
        <p className="text-muted-foreground text-lg mb-8">Manage your tutoring business and students.</p>

        {/* Tabs: Message Chat, My Students, Profile Settings, Schedule/Availability, Earnings */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Message Chat */}
          <Card>
            <CardHeader>
              <CardTitle>Message Chat</CardTitle>
              <CardDescription>Chat with your students</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Real-time chat with a student (demo: static chatId) */}
              <ChatBox chatId="demo-student-tutor-chat" user={{
                uid: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("userInfo")||"{}")?.uid : "",
                name: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("userInfo")||"{}")?.firstName : "Tutor"
              }} />
            </CardContent>
          </Card>

          {/* My Students */}
          <Card>
            <CardHeader>
              <CardTitle>My Students</CardTitle>
              <CardDescription>View and manage your students</CardDescription>
            </CardHeader>
            <CardContent>
              {/* TODO: List students from Firebase */}
              <Button className="w-full bg-primary mt-2">View Students</Button>
            </CardContent>
          </Card>

          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Update your profile and expertise</CardDescription>
            </CardHeader>
            <CardContent>
              {/* TODO: Profile settings form */}
              <Button className="w-full bg-secondary mt-2">Edit Profile</Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Schedule/Availability */}
          <Card>
            <CardHeader>
              <CardTitle>Schedule / Availability</CardTitle>
              <CardDescription>Set your available times for sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {/* TODO: Schedule/availability UI and logic */}
              <Button className="w-full bg-accent mt-2">Set Availability</Button>
            </CardContent>
          </Card>

          {/* Earnings */}
          <Card>
            <CardHeader>
              <CardTitle>Earnings</CardTitle>
              <CardDescription>View your earnings and payouts</CardDescription>
            </CardHeader>
            <CardContent>
              {/* TODO: Earnings summary from Firebase */}
              <Button className="w-full bg-green-600 text-white mt-2">View Earnings</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
