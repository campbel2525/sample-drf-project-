'use client'

interface Props {
  message: string
}

export default function SuccessMessageComponent({ message }: Props) {
  return (
    <>
      <div>{message}</div>
    </>
  )
}
