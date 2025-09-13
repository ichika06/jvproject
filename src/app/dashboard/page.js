
"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userInfo = localStorage.getItem("userInfo")
      if (userInfo) {
        const parsed = JSON.parse(userInfo)
        if (parsed.userType === "student") {
          router.replace("/dashboard/student")
        } else if (parsed.userType === "tutor") {
          router.replace("/dashboard/tutor")
        }
      }
    }
  }, [router])
  return <div className="min-h-screen flex items-center justify-center text-lg">Loading dashboard...</div>
}
