'use client'

import { Box, FormControl, FormLabel, Input, Button } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import ServerErrorComponent from '@/components/common/ServerErrorComponent'
import ErrorMessageComponent from '@/components/messages/ErrorMessageComponent'
import ValidationErrorMessagesComponent from '@/components/messages/ValidationErrorMessagesComponent'
import { frontPaths } from '@/config/settings'
import type { SignupRequest } from '@/types/requests/account-requests'
import { client } from '@/utils/front-client'

export default function SignupFormComponent() {
  const router = useRouter()

  const [errorMessage, setErrorMessage] = useState<string>('')
  const [validationError, setValidationError] = useState<Record<string, string[]>>({})
  const [inputData, setInputData] = useState<SignupRequest>({
    email: '',
    password: '',
    name: '',
  })
  const [handleResponse, setHandleResponse] = useState<Response | null>(null)

  const handle = async (): Promise<void> => {
    setErrorMessage('')
    setValidationError({})

    const response = await client('POST', '/api/accounts/signup', null, inputData)
    setHandleResponse(response)
    const responseData = await response.json()
    if (!response.ok) {
      if (response.status === 400) {
        setValidationError(responseData)
      }
      if (responseData?.detail) {
        setErrorMessage(responseData.detail)
      }
      return
    }

    // OTP認証画面に遷移
    router.push(frontPaths.signupConfirm)
    router.refresh()
  }

  if (handleResponse?.status === 500) {
    return <ServerErrorComponent />
  }

  return (
    <Box p={8} maxWidth="100%" width="100%">
      <Box maxWidth="100%">
        <FormControl id="email">
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            type="email"
            value={inputData.email}
            onChange={(e) => setInputData({ ...inputData, email: e.target.value })}
          />
        </FormControl>
        <FormControl id="password">
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            type="password"
            value={inputData.password}
            onChange={(e) => setInputData({ ...inputData, password: e.target.value })}
          />
        </FormControl>
        <FormControl id="name">
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input
            type="name"
            value={inputData.name}
            onChange={(e) => setInputData({ ...inputData, name: e.target.value })}
          />
        </FormControl>
        <Button width="full" mt={4} type="submit" onClick={handle}>
          新規登録
        </Button>
      </Box>

      <Box p={8} maxWidth="400px">
        {Object.keys(validationError).length > 0 && (
          <ValidationErrorMessagesComponent validationError={validationError} />
        )}
        {errorMessage && <ErrorMessageComponent message={errorMessage} />}
      </Box>
    </Box>
  )
}
