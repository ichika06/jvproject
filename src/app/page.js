import { Button } from "@/components/ui/button"
import { GraduationCap } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-8 max-w-2xl mx-auto px-6">
        <div className="space-y-4">
          <div className="flex items-center justify-center mb-6">
            <GraduationCap className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-5xl font-bold text-foreground text-balance">Welcome to TutorConnect</h1>
          <p className="text-xl text-muted-foreground text-pretty">
            Connect with expert tutors or share your knowledge. Start your learning journey today.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-border bg-transparent">
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>

        <div className="pt-8">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/dashboard" className="text-primary hover:underline">
              Go to Dashboard
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
