import { ArrowLeft } from 'lucide-react'
import Input from '../forms/Input'
import Button from '../ui/Button'

export default function Step2({
  firstName,
  lastName,
  errors,
  touched,
  onFirstNameChange,
  onLastNameChange,
  onSubmit,
  onBack,
}) {
  const isFormValid = firstName.trim() && lastName.trim()

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col items-start w-full rounded-xl"
    >
      <div className="flex flex-col gap-5 items-start w-full">
        {/* First Name Input */}
        <Input
          label="First Name"
          type="text"
          placeholder="Enter your first name"
          error={touched && errors.firstName ? errors.firstName : undefined}
          value={firstName}
          onChange={onFirstNameChange}
          required
        />

        {/* Last Name Input */}
        <Input
          label="Last Name"
          type="text"
          placeholder="Enter your last name"
          error={touched && errors.lastName ? errors.lastName : undefined}
          value={lastName}
          onChange={onLastNameChange}
          required
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col mt-6 gap-4 items-start w-full">
        <Button 
          type="submit" 
          variant="primary" 
          size="md" 
          className="w-full"
          disabled={!isFormValid}
        >
          Continue
        </Button>
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-l2-medium text-base-secondary hover:opacity-80 transition-opacity self-center"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>
    </form>
  )
}

