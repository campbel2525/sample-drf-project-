'use client'

import { Box, FormControl, FormLabel, Input, Button } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import ServerErrorComponent from '@/components/common/ServerErrorComponent'
import ErrorMessageComponent from '@/components/messages/ErrorMessageComponent'
import ValidationErrorMessagesComponent from '@/components/messages/ValidationErrorMessagesComponent'
import { frontPaths } from '@/config/settings'
import type { User } from '@/types/models'
import type { UpdateProfileRequest } from '@/types/requests/account-requests'
import { client } from '@/utils/front-client'

export default function UpdateProfileFormComponent({ user }: { user: User }) {
  const router = useRouter()

  const [errorMessage, setErrorMessage] = useState<string>('')
  const [validationError, setValidationError] = useState<Record<string, string[]>>({})
  const [inputData, setInputData] = useState<UpdateProfileRequest>({
    name: user.name,
  })
  const [handleResponse, setHandleResponse] = useState<Response | null>(null)

  const handle = async (): Promise<void> => {
    setErrorMessage('')
    setValidationError({})

    const response = await client(
      'PUT',
      '/api/accounts/update-profile/',
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

    router.push(frontPaths.home)
    router.refresh()
  }

  if (handleResponse?.status === 500) {
    return <ServerErrorComponent />
  }

  return (
    <Box p={8} maxWidth="100%" width="100%">
      <Box maxWidth="100%">
        <FormControl id="name">
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input
            type="name"
            value={inputData.name}
            onChange={(e) => setInputData({ ...inputData, name: e.target.value })}
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
