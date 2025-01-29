'use client'

import { Box, FormControl, FormLabel, Input, Button } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import ServerErrorComponent from '@/components/common/ServerErrorComponent'
import ErrorMessageComponent from '@/components/messages/ErrorMessageComponent'
import ValidationErrorMessagesComponent from '@/components/messages/ValidationErrorMessagesComponent'
import { frontPaths } from '@/config/settings'
import type { UpdateEmailRequest } from '@/types/requests/account-requests'
import { client } from '@/utils/front-client'

export default function LoginFormComponent() {
  const router = useRouter()

  const [errorMessage, setErrorMessage] = useState<string>('')
  const [validationError, setValidationError] = useState<Record<string, string[]>>({})
  const [inputData, setInputData] = useState<UpdateEmailRequest>({
    new_email: '',
    password: '',
  })
  const [handleResponse, setHandleResponse] = useState<Response | null>(null)

  const handle = async (): Promise<void> => {
    setErrorMessage('')
    setValidationError({})

    const response = await client('PUT', '/api/accounts/update-email', null, inputData)
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

    // OTP画面に遷移
    router.push(frontPaths.updateEmailConfirm) // 適切なパスに変更
  }

  if (handleResponse?.status === 500) {
    return <ServerErrorComponent />
  }

  return (
    <Box p={8} maxWidth="100%" width="100%">
      <p>sample user</p>
      {/* <p>user1@example.com</p>
      <p>test1234</p> */}

      <Box maxWidth="100%">
        <FormControl id="email">
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            type="email"
            value={inputData.new_email}
            onChange={(e) => setInputData({ ...inputData, new_email: e.target.value })}
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
        <Button width="full" mt={4} type="submit" onClick={handle}>
          更新
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
