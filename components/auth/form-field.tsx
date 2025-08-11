import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface FormFieldProps {
  label: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'select' | 'checkbox' | 'file'
  placeholder?: string
  required?: boolean
  error?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  options?: { value: string; label: string }[]
  helper?: string
  accept?: string
}

export function FormField({
  label,
  type = 'text',
  placeholder,
  required,
  error,
  value,
  onChange,
  options,
  helper,
  accept
}: FormFieldProps) {
  const id = label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      
      {type === 'select' ? (
        <Select id={id} value={value} onChange={onChange} required={required}>
          <option value="">নির্বাচন করুন</option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ) : type === 'checkbox' ? (
        <Checkbox
          id={id}
          label={label}
          checked={value === 'true'}
          onChange={onChange}
          required={required}
        />
      ) : (
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          accept={accept}
          className={error ? 'border-red-500' : ''}
        />
      )}
      
      {helper && <p className="text-sm text-gray-500">{helper}</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
