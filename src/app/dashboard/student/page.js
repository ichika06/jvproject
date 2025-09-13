"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeSwitcher } from "@/components/themeswitcher"
import { Bell, Settings } from "lucide-react"
import ChatBox from "@/components/ui/ChatBox"

export default function StudentDashboard() {
  const [userName, setUserName] = useState("")
  const [showTutors, setShowTutors] = useState(false)
  const [tutors, setTutors] = useState([])
  const [loadingTutors, setLoadingTutors] = useState(false)
  const [tutorError, setTutorError] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userInfo = localStorage.getItem("userInfo")
      if (userInfo) {
        const parsed = JSON.parse(userInfo)
        setUserName(parsed.firstName + " " + parsed.lastName)
      }
    }
  }, [])

  const handleSearchTutors = async () => {
    setShowTutors(true)
    setLoadingTutors(true)
    setTutorError("")
    try {
      const res = await fetch("/api/tutors")
      if (!res.ok) throw new Error("Failed to fetch tutors")
      const data = await res.json()
      setTutors(data?.data || [])
    } catch (err) {
      setTutorError("Could not load tutors. Please try again later.")
    }
    setLoadingTutors(false)
  }

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
              <ThemeSwitcher />
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
        <p className="text-muted-foreground text-lg mb-8">What would you like to do today?</p>

        {/* Tabs: Search Tutors, My Bookings */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Search Tutors */}
          <Card>
            <CardHeader>
              <CardTitle>Search Tutors</CardTitle>
              <CardDescription>Find and book sessions with available tutors</CardDescription>
            </CardHeader>
            <CardContent>
              {/* TODO: Add search/filter tutors UI and booking logic */}
              <Button className="w-full bg-primary mt-2" onClick={handleSearchTutors}>Search Tutors</Button>
              <Dialog open={showTutors} onOpenChange={setShowTutors}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Available Tutors</DialogTitle>
                    <DialogDescription>Browse and book sessions with tutors</DialogDescription>
                  </DialogHeader>
                  {loadingTutors && <div className="py-4 text-center">Loading tutors...</div>}
                  {tutorError && <div className="py-4 text-center text-red-500">{tutorError}</div>}
                  {!loadingTutors && !tutorError && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                      {tutors.length === 0 && <div className="col-span-2 text-center">No tutors found.</div>}
                      {tutors.map(tutor => (
                        <Card key={tutor._id} className="border p-4">
                          <CardHeader>
                            <CardTitle>{tutor.name}</CardTitle>
                            <CardDescription>{tutor.subjects?.join(", ")}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div>Email: {tutor.email}</div>
                            <div>Phone: {tutor.phone}</div>
                            <div>Experience: {tutor.experience} years</div>
                            {/* Add booking button here */}
                            <Button className="mt-2 w-full" variant="secondary">Book Session</Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* My Bookings */}
          <Card>
            <CardHeader>
              <CardTitle>My Bookings</CardTitle>
              <CardDescription>View and manage your upcoming sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {/* TODO: List student's booked sessions from Firebase */}
              <Button className="w-full mt-2">View Bookings</Button>
            </CardContent>
          </Card>
        </div>

        {/* Message Chat, Session Page, Feedback, Reviews */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Message Chat</CardTitle>
              <CardDescription>Chat with your tutors</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Real-time chat with a tutor (demo: static chatId) */}
              <ChatBox chatId="demo-student-tutor-chat" user={{
                uid: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("userInfo")||"{}")?.uid : "",
                name: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("userInfo")||"{}")?.firstName : "Student"
              }} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Session Feedback & Reviews</CardTitle>
              <CardDescription>Leave feedback for your sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {/* TODO: Feedback form and reviews list from Firebase */}
              <Button className="w-full mt-2">Give Feedback</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
