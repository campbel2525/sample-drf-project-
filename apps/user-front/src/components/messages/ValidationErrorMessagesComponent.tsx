'use client'

interface Props {
  validationError: Record<string, string[]>
}

export default function ValidationErrorMessagesComponent({ validationError }: Props) {
  return (
    <div>
      {Object.entries(validationError).map(([field, errors]) => (
        <div key={field}>
          {field}:
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      ))}
    </div>
  )
}
