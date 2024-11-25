import { Box } from '@chakra-ui/react'

import NotFoundComponent from '@/components/common/NotFoundComponent'
import ServerErrorComponent from '@/components/common/ServerErrorComponent'
import UpdateProfileFormComponent from '@/components/forms/UpdateProfileFormComponent'
import ErrorMessageComponent from '@/components/messages/ErrorMessageComponent'
import ValidationErrorMessagesComponent from '@/components/messages/ValidationErrorMessagesComponent'
import { fetchClient } from '@/utils/backend-client'

export default async function UpdateProfileFetchComponent() {
  let validationError = {}
  let errorMessage = ''

  // チャットメッセージリスト
  const response = await fetchClient('GET', `/api/accounts/me`)
  const responseData = await response.json()
  if (!response.ok) {
    if (response.status === 400) {
      validationError = responseData
    }
    if (response.status === 404) {
      return <NotFoundComponent />
    }
    if (response.status === 500) {
      return <ServerErrorComponent />
    }
    if (responseData?.detail) {
      errorMessage = responseData.detail
    }
  }

  return (
    <>
      <Box height="100%" overflow="hidden">
        {responseData && <UpdateProfileFormComponent user={responseData} />}
      </Box>

      {Object.keys(validationError).length > 0 && (
        <Box p={8}>
          <ValidationErrorMessagesComponent validationError={validationError} />
        </Box>
      )}
      {errorMessage && (
        <Box p={8}>
          <ErrorMessageComponent message={errorMessage} />
        </Box>
      )}
    </>
  )
}
