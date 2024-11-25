'use client'

import { Box, FormControl, FormLabel, Input, Button } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import ServerErrorComponent from '@/components/common/ServerErrorComponent'
import ErrorMessageComponent from '@/components/messages/ErrorMessageComponent'
import ValidationErrorMessagesComponent from '@/components/messages/ValidationErrorMessagesComponent'
import { frontPaths } from '@/config/settings'
import { OneTimePasswordRequest } from '@/types/requests/account-requests'
import { client } from '@/utils/front-client'

export default function SignupConfirmFormComponent() {
  const router = useRouter()

  const [inputData, setInputData] = useState<OneTimePasswordRequest>({
    one_time_password: '',
  })
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [validationError, setValidationError] = useState<Record<string, string[]>>({})
  const [handleResponse, setHandleResponse] = useState<Response | null>(null)

  const handle = async (): Promise<void> => {
    setErrorMessage('')
    setValidationError({})

    const response = await client(
      'POST',
      '/api/accounts/signup/confirm',
      null,
      inputData
    )
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

    // OTP認証成功後のリダイレクト
    router.push(frontPaths.home) // 認証後のページにリダイレクト
  }

  if (handleResponse?.status === 500) {
    return <ServerErrorComponent />
  }

  return (
    <Box p={8} maxWidth="100%" width="100%">
      <Box maxWidth="100%">
        <FormControl id="one_time_password">
          <FormLabel htmlFor="one_time_password">one time password</FormLabel>
          <Input
            type="one_time_password"
            value={inputData.one_time_password}
            onChange={(e) =>
              setInputData({ ...inputData, one_time_password: e.target.value })
            }
          />
        </FormControl>
        <Button width="full" mt={4} type="submit" onClick={handle}>
          認証
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
