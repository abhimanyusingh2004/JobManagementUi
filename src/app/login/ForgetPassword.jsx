import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { API_URL } from "@/lib/contant"
import { ThemeProvider } from "@/components/theme/ThemeProvider"

function ForgetPassword() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [timer, setTimer] = useState(0)
  const [canResend, setCanResend] = useState(false)

  const navigate = useNavigate()

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    } else {
      setCanResend(true)
    }
  }, [timer])

  // Format timer as MM:SS
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e?.preventDefault()
    if (!email) return toast.error("Please enter your email.")

    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/User/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(email),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || "Failed to send OTP.")
        return
      }

      toast.success(data.message || "OTP sent to your email!")
      setStep(2)
      setTimer(60)
      setCanResend(false)
      setOtp("")
    } catch (error) {
      toast.error("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Step 2: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (!otp || !newPassword) return toast.error("OTP and new password are required.")
    if (otp.length !== 6) return toast.error("OTP must be 6 digits.")

    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/User/reset-password-with-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || "Failed to reset password.")
        return
      }

      toast.success(data.message || "Password reset successfully!")
      setTimeout(() => navigate("/login"), 1500)
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <div className="relative">
            <div className="absolute h-46 w-46 bg-green-300 rounded-full -top-20 -left-20 bg-[linear-gradient(135deg,#32b171,#b5f7d6)]" />
            <div className="absolute h-46 w-46 bg-green-300 rounded-full -bottom-20 -right-20 bg-[linear-gradient(135deg,#d8f3f9,#60c1d6)]" />

            <Card className="relative z-10 bg-white/30 dark:bg-black/30 backdrop-blur-md shadow-lg">
              <CardHeader className="text-center">
                <img src="./logo.png" alt="logo" className="max-h-14 w-fit mx-auto" />
                <CardTitle className="text-xl">
                  {step === 1 ? "Forgot Password" : "Reset Password"}
                </CardTitle>
                <CardDescription>
                  {step === 1
                    ? "Enter your email to receive an OTP"
                    : "Enter OTP and set a new password"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {/* Step 1: Email */}
                {step === 1 && (
                  <form onSubmit={handleSendOtp}>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          autoComplete="email"
                        />
                      </div>

                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending OTP...
                          </>
                        ) : (
                          "Send OTP"
                        )}
                      </Button>
                    </div>
                  </form>
                )}

                {/* Step 2: OTP + New Password */}
                {step === 2 && (
                  <form onSubmit={handleResetPassword}>
                    <div className="grid gap-6">
                      {/* OTP Field with Paste Support */}
                      <div className="grid gap-3">
                        <Label htmlFor="otp">Enter OTP</Label>
                        <div className="flex gap-2">
                          <Input
                            id="otp"
                            type="text"
                            placeholder="Enter the Otp"
                            value={otp}
                            onChange={(e) => {
                              const value = e.target.value
                              const digitsOnly = value.replace(/\D/g, "").slice(0, 6)
                              setOtp(digitsOnly)
                            }}
                            onPaste={(e) => {
                              e.preventDefault()
                              const pasted = e.clipboardData.getData("text")
                              const digitsOnly = pasted.replace(/\D/g, "").slice(0, 6)
                              setOtp(digitsOnly)
                            }}
                            required
                            maxLength={6}
                            className=" text-md  text-left"
                            autoComplete="one-time-code"
                            inputMode="numeric"
                          />
                        </div>

                        {/* Timer & Resend */}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {timer > 0 ? `Resend in ${formatTimer(timer)}` : "Didn't receive OTP?"}
                          </span>
                          <Button
                            type="button"
                            variant="link"
                            size="sm"
                            onClick={handleSendOtp}
                            disabled={!canResend || isLoading}
                            className="p-0 h-auto font-medium"
                          >
                            Resend OTP
                          </Button>
                        </div>
                      </div>

                      {/* New Password */}
                      <div className="grid gap-3">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder="••••••••"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          autoComplete="new-password"
                        />
                      </div>

                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Resetting...
                          </>
                        ) : (
                          "Submit"
                        )}
                      </Button>
                    </div>
                  </form>
                )}

                {/* Back to Login */}
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-sm text-primary hover:underline flex items-center justify-center gap-1 mx-auto"
                  >
                    <ArrowLeft size={16} />
                    Back to Login
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-muted-foreground text-center text-xs text-balance">
            By continuing, you agree to our{" "}
            <a href="#" className="underline underline-offset-4">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline underline-offset-4">
              Privacy Policy
            </a>.
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default ForgetPassword