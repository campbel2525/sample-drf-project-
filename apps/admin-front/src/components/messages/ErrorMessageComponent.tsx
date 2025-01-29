'use client'

interface Props {
  message: string
}

export default function ErrorMessageComponent({ message }: Props) {
  return (
    <>
      <div>{message}</div>
    </>
  )
}
