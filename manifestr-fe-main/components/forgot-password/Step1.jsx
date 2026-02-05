import { useState } from 'react'
import { Key } from 'lucide-react'
import Button from '../ui/Button'
import Input from '../forms/Input'

export default function Step1({ onNext }) {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState(false)

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) return 'Email is required'
    if (!emailRegex.test(email)) return 'Please enter a valid email address'
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched(true)
    
    const emailError = validateEmail(email)
    if (emailError) {
      setErrors({ email: emailError })
      return
    }
    
    // Move to step 2
    setErrors({})
    onNext(email)
  }

  return (
    <>
      {/* Key Icon */}
      <div className="w-10 h-10 border border-[#e4e4e7] rounded-md flex items-center justify-center">
        <Key className="w-5 h-5 text-zinc-400" />
      </div>

      {/* Title and Subtitle */}
      <div className="flex flex-col gap-3 items-center text-center w-full">
        <h1 className="text-[24px] leading-[32px] font-semibold text-[#09090b] font-hero">
          Forgot Password?
        </h1>
        <p className="text-l2-regular text-base-muted-foreground">
          Enter your email address to receive a password reset code
        </p>
      </div>

      {/* Email Input Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
        <Input
          label="Email address"
          type="email"
          placeholder="your@email.com"
          helperText={!touched || !errors.email ? "We'll send a reset code to this email" : undefined}
          error={touched && errors.email ? errors.email : undefined}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (touched && errors.email) {
              const newErrors = { ...errors }
              delete newErrors.email
              setErrors(newErrors)
            }
          }}
          required
        />

        {/* Next Button */}
        <Button 
          type="submit" 
          variant="primary" 
          size="md" 
          className="w-full"
          disabled={!email}
        >
          Next
        </Button>
      </form>
    </>
  )
}

