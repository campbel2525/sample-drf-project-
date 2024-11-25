'use client'

import { Box, FormControl, FormLabel, Input, Button } from '@chakra-ui/react'
import { useState } from 'react'

import ServerErrorComponent from '@/components/common/ServerErrorComponent'
import ErrorMessageComponent from '@/components/messages/ErrorMessageComponent'
import ValidationErrorMessagesComponent from '@/components/messages/ValidationErrorMessagesComponent'
import { ResetPasswordConfirmRequest } from '@/types/requests/account-requests'
import { client } from '@/utils/front-client'

export default function ResetPasswordFormComponent({ token }: { token: string }) {
  const [inputData, setInputData] = useState<ResetPasswordConfirmRequest>({
    token: token,
    new_password: '',
  })
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [validationError, setValidationError] = useState<Record<string, string[]>>({})
  const [handleResponse, setHandleResponse] = useState<Response | null>(null)

  const handle = async (): Promise<void> => {
    setErrorMessage('')
    setValidationError({})

    const response = await client(
      'POST',
      '/api/accounts/reset-password/confirm',
      null,
      inputData
    )
    setHandleResponse(response)

    if (response.status === 204) {
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

  if (handleResponse?.status === 204) {
    return (
      <>
        <p>パスワードをリセットしました。下記のリンクからログインをお願いします。</p>
        <a href="">login ページ</a>
      </>
    )
  }

  return (
    <Box p={8} maxWidth="100%" width="100%">
      <Box maxWidth="100%">
        <FormControl id="one_time_password">
          <FormLabel htmlFor="one_time_password">reset password</FormLabel>
          <Input
            type="password"
            value={inputData.new_password}
            onChange={(e) =>
              setInputData({ ...inputData, new_password: e.target.value })
            }
          />
        </FormControl>
        <Button width="full" mt={4} type="submit" onClick={handle}>
          送信
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
