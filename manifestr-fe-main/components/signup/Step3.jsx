import { ArrowLeft } from 'lucide-react'
import Button from '../ui/Button'
import DateInput from '../forms/DateInput'
import Select from '../forms/Select'
import RadioButton from '../forms/RadioButton'
import Checkbox from '../forms/Checkbox'

export default function Step3({
  dateOfBirth,
  country,
  gender,
  earlyAccess,
  termsAccepted,
  errors,
  touched,
  onDateOfBirthChange,
  onCountryChange,
  onGenderChange,
  onEarlyAccessChange,
  onTermsAcceptedChange,
  onSubmit,
  onBack,
  isSubmitting,
}) {
  const countryOptions = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'it', label: 'Italy' },
    { value: 'es', label: 'Spain' },
    { value: 'nl', label: 'Netherlands' },
    { value: 'be', label: 'Belgium' },
    { value: 'ch', label: 'Switzerland' },
    { value: 'at', label: 'Austria' },
    { value: 'se', label: 'Sweden' },
    { value: 'no', label: 'Norway' },
    { value: 'dk', label: 'Denmark' },
    { value: 'fi', label: 'Finland' },
    { value: 'ie', label: 'Ireland' },
    { value: 'pt', label: 'Portugal' },
    { value: 'pl', label: 'Poland' },
    { value: 'cz', label: 'Czech Republic' },
    { value: 'gr', label: 'Greece' },
    { value: 'nz', label: 'New Zealand' },
    { value: 'jp', label: 'Japan' },
    { value: 'kr', label: 'South Korea' },
    { value: 'cn', label: 'China' },
    { value: 'in', label: 'India' },
    { value: 'br', label: 'Brazil' },
    { value: 'mx', label: 'Mexico' },
    { value: 'ar', label: 'Argentina' },
    { value: 'za', label: 'South Africa' },
  ]

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col items-start w-full rounded-xl"
    >
      <div className="flex flex-col gap-5 items-start w-full">
        {/* Date of Birth Input */}
        <DateInput
          label="Date of Birth"
          placeholder="Select date"
          value={dateOfBirth}
          onChange={onDateOfBirthChange}
          error={touched && errors.dateOfBirth ? errors.dateOfBirth : undefined}
          required
        />

        {/* Country Select */}
        <Select
          label="Country"
          placeholder="Select country"
          value={country}
          onChange={onCountryChange}
          options={countryOptions}
          error={touched && errors.country ? errors.country : undefined}
          required
        />

        {/* Gender Radio Buttons */}
        <div className="flex flex-col gap-1.5 items-start w-full">
          <div className="flex gap-0.5 items-start">
            <label className="text-l2-medium text-[#52525B]">
              Gender
            </label>
            <span className="text-l2-medium text-[#dc2626]">*</span>
          </div>
          <div className="flex gap-1 items-center w-full">
            <RadioButton
              label="Male"
              value="male"
              checked={gender === 'male'}
              onChange={onGenderChange}
            />
            <RadioButton
              label="Female"
              value="female"
              checked={gender === 'female'}
              onChange={onGenderChange}
            />
            <RadioButton
              label="Other"
              value="other"
              checked={gender === 'other'}
              onChange={onGenderChange}
            />
          </div>
          {touched && errors.gender && (
            <p className="text-l2-regular text-[#dc2626]">
              {errors.gender}
            </p>
          )}
        </div>
      </div>

      {/* Checkboxes */}
      <div className="flex flex-col mt-6 gap-4 items-start w-full">
        <Checkbox
          checked={earlyAccess}
          onChange={onEarlyAccessChange}
          label="Get early access, exclusive updates, and insider drops from MANIFESTR"
        />
        <Checkbox
          checked={termsAccepted}
          onChange={onTermsAcceptedChange}
          label="By proceeding, you agree to the Terms and Conditions and Privacy Policy."
        />
        {touched && errors.termsAccepted && (
          <p className="text-l2-regular text-[#dc2626]">
            {errors.termsAccepted}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col mt-6 gap-4 items-start w-full">
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full"
          disabled={!dateOfBirth || !country || !gender || !termsAccepted || isSubmitting}
        >
          {isSubmitting ? 'Creating account...' : 'Finish & Get Started'}
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

