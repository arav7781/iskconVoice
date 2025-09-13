import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-yellow-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-8 h-8 text-orange-200 animate-float">🪷</div>
        <div className="absolute top-40 right-20 w-6 h-6 text-blue-200 animate-bounce">🪷</div>
        <div className="absolute bottom-32 left-20 w-7 h-7 text-yellow-200 animate-pulse">🪷</div>
        <div className="absolute bottom-20 right-10 w-5 h-5 text-orange-200 animate-float">🪷</div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <Card className="backdrop-blur-sm bg-white/90 border-orange-200 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-orange-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-2xl text-white">✉️</span>
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
              Check Your Email
            </CardTitle>
            <CardDescription className="text-gray-600">We've sent you a confirmation link</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              Thank you for joining ISKCON! Please check your email and click the confirmation link to activate your
              account.
            </p>
            <p className="text-xs text-gray-500">
              Don't see the email? Check your spam folder or try signing up again.
            </p>
            <Button
              asChild
              className="w-full bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600"
            >
              <Link href="/auth/login">Back to Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
