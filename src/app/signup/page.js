"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { initializeApp } from "firebase/app"
import { getFirestore, doc, setDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Users, GraduationCap, UserCheck, UserPlus } from "lucide-react"
import Link from "next/link"

// Firebase config (replace with your own config from Firebase Console)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase only once
let firebaseApp
if (typeof window !== "undefined" && !globalThis._firebaseApp) {
  firebaseApp = initializeApp(firebaseConfig)
  globalThis._firebaseApp = firebaseApp
} else if (typeof window !== "undefined") {
  firebaseApp = globalThis._firebaseApp
}

const auth = typeof window !== "undefined" ? getAuth(firebaseApp) : null
const db = typeof window !== "undefined" ? getFirestore(firebaseApp) : null

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "student",
    agreeToTerms: false,
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!")
      setIsLoading(false)
      return
    }

    if (!formData.agreeToTerms) {
      alert("Please agree to the terms and conditions")
      setIsLoading(false)
      return
    }

    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      )
      // Optionally update user profile with first/last name
      await updateProfile(userCredential.user, {
        displayName: `${formData.firstName} ${formData.lastName}`,
      })
      // Save user info to Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        userType: formData.userType,
        createdAt: new Date().toISOString(),
      })
      // Store user info with UID in localStorage
      localStorage.setItem("userInfo", JSON.stringify({
        uid: userCredential.user.uid,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        userType: formData.userType
      }))
      // Redirect to dashboard after successful signup
      window.location.href = "/dashboard"
    } catch (error) {
      alert(error.message || "Signup failed. Please try again.")
    }
    setIsLoading(false)
  }

  return (
    <motion.div
      className="min-h-screen flex"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* Left side - Hero Section */}
      <motion.div
        className="flex-1 bg-card flex items-center justify-center p-8"
        initial={{ opacity: 0, x: -200 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 200 }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
      >
        <div className="max-w-lg text-center space-y-8">
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-card-foreground text-balance">Start Your Learning Journey</h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Whether you're seeking knowledge or sharing expertise, TutorConnect is your gateway to meaningful
              educational connections.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.div
              className="flex items-center space-x-4 p-4 rounded-lg bg-background/50"
              whileHover={{ scale: 1.02, x: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-2 rounded-full bg-primary/10">
                <UserCheck className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-card-foreground">For Students</h3>
                <p className="text-sm text-muted-foreground">Find expert tutors in any subject</p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center space-x-4 p-4 rounded-lg bg-background/50"
              whileHover={{ scale: 1.02, x: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-2 rounded-full bg-secondary/10">
                <UserPlus className="h-6 w-6 text-secondary" />
              </div>
              <div className="text-left">
                <h3 className="font-semibent text-card-foreground">For Tutors</h3>
                <p className="text-sm text-muted-foreground">Share your knowledge and earn income</p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center space-x-4 p-4 rounded-lg bg-background/50"
              whileHover={{ scale: 1.02, x: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-2 rounded-full bg-accent/10">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-card-foreground">Safe & Secure</h3>
                <p className="text-sm text-muted-foreground">Verified profiles and secure payments</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right side - Signup Form */}
      <motion.div
        className="flex-1 flex items-center justify-center p-8 bg-background"
        initial={{ opacity: 0, x: 200 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -200 }}
        transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
      >
        <div className="w-full max-w-md space-y-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center justify-center mb-4">
              <GraduationCap className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Join TutorConnect</h1>
            <p className="text-muted-foreground mt-2">Create your account to get started</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Fill in your details to create your account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required
                        className="bg-input border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required
                        className="bg-input border-border"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      className="bg-input border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                      className="bg-input border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      required
                      className="bg-input border-border"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>I want to:</Label>
                    <RadioGroup
                      value={formData.userType}
                      onValueChange={(value) => handleInputChange("userType", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="student" id="student" />
                        <Label htmlFor="student" className="cursor-pointer">
                          Find a tutor (Student)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="tutor" id="tutor" />
                        <Label htmlFor="tutor" className="cursor-pointer">
                          Become a tutor (Tutor)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked)}
                    />
                    <Label htmlFor="terms" className="text-sm cursor-pointer">
                      {"I agree to the "}
                      <Link href="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>
                      {" and "}
                      <Link href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    {"Already have an account? "}
                    <Link href="/login" className="text-primary hover:underline font-medium">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
