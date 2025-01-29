'use client'

import { Box, FormControl, FormLabel, Input, Button } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import ServerErrorComponent from '@/components/common/ServerErrorComponent'
import ErrorMessageComponent from '@/components/messages/ErrorMessageComponent'
import ValidationErrorMessagesComponent from '@/components/messages/ValidationErrorMessagesComponent'
import { frontPaths } from '@/config/settings'
import type { UpdatePasswordRequest } from '@/types/requests/account-requests'
import { client } from '@/utils/front-client'

export default function UpdatePasswordFormComponent() {
  const router = useRouter()

  const [errorMessage, setErrorMessage] = useState<string>('')
  const [validationError, setValidationError] = useState<Record<string, string[]>>({})
  const [inputData, setInputData] = useState<UpdatePasswordRequest>({
    current_password: '',
    new_password: '',
  })
  const [handleResponse, setHandleResponse] = useState<Response | null>(null)

  const handle = async (): Promise<void> => {
    setErrorMessage('')
    setValidationError({})

    const response = await client(
      'PUT',
      '/api/accounts/update-password',
      null,
      inputData
    )
    setHandleResponse(response)
    if (response.status === 204) {
      router.push(frontPaths.home)
      return
    }

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
        <FormControl id="current_password">
          <FormLabel htmlFor="current_password">current password</FormLabel>
          <Input
            type="password"
            value={inputData.current_password}
            onChange={(e) =>
              setInputData({ ...inputData, current_password: e.target.value })
            }
          />
        </FormControl>
        <FormControl id="new_password">
          <FormLabel htmlFor="new_password">new password</FormLabel>
          <Input
            type="password"
            value={inputData.new_password}
            onChange={(e) =>
              setInputData({ ...inputData, new_password: e.target.value })
            }
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
