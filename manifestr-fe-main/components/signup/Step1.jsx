import Input from '../forms/Input'
import Button from '../ui/Button'
import GoogleIcon from '../icons/GoogleIcon'

export default function Step1({
  email,
  password,
  confirmPassword,
  errors,
  touched,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-6 items-start w-full rounded-xl"
      autoComplete="off"
    >
      <div className="flex flex-col gap-5 items-start w-full">
        {/* Email Input */}
        <Input
          label="Email address"
          type="email"
          placeholder="Enter your email"
          error={touched && errors.email ? errors.email : undefined}
          value={email}
          onChange={onEmailChange}
          autoComplete="off"
          required
        />

        {/* Password Input */}
        <Input
          label="Password"
          type="password"
          placeholder="Create a password"
          helperText={!touched || !errors.password ? "Minimum 8 characters. Use letters and numbers." : undefined}
          error={touched && errors.password ? errors.password : undefined}
          value={password}
          onChange={onPasswordChange}
          showPasswordToggle
          autoComplete="new-password"
          required
        />

        {/* Confirm Password Input */}
        <Input
          label="Confirm Password"
          type="password"
          placeholder="one more time to seal the deal"
          error={touched && errors.confirmPassword ? errors.confirmPassword : undefined}
          value={confirmPassword}
          onChange={onConfirmPasswordChange}
          showPasswordToggle
          autoComplete="new-password"
          required
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 items-center w-full">
        <div className="flex flex-col gap-4 items-start w-full">
          <Button type="submit" variant="primary" size="md" className="w-full">
            Join MANIFESTR.
          </Button>
          <Button type="button" variant="secondary" size="md" className="w-full border-[#e4e4e7]">
            <GoogleIcon className="mr-2" />
            Sign up with Google
          </Button>
        </div>
        <p className="text-[13px] leading-[18px] text-[#71717b] text-center">
          Safe & private. No data shared without consent.
        </p>
      </div>
    </form>
  )
}

