import { Box } from '@chakra-ui/react'

import NotFoundComponent from '@/components/common/NotFoundComponent'
import ServerErrorComponent from '@/components/common/ServerErrorComponent'
import UserUpdateFormComponent from '@/components/forms/UserUpdateFormComponent'
import ErrorMessageComponent from '@/components/messages/ErrorMessageComponent'
import ValidationErrorMessagesComponent from '@/components/messages/ValidationErrorMessagesComponent'
import { fetchClient } from '@/utils/backend-client'

export default async function UserUpdateFetchComponent({ userId }: { userId: number }) {
  let validationError = {}
  let errorMessage = ''

  const response = await fetchClient('GET', `/api/users/${userId}/`)
  const responseData = await response.json()
  if (!response.ok) {
    if (response.status === 404) {
      return <NotFoundComponent />
    }
    if (response.status === 400) {
      validationError = responseData
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
      {responseData && <UserUpdateFormComponent user={responseData} />}

      <Box p={8} maxWidth="400px">
        {Object.keys(validationError).length > 0 && (
          <ValidationErrorMessagesComponent validationError={validationError} />
        )}
        {errorMessage && <ErrorMessageComponent message={errorMessage} />}
      </Box>
    </>
  )
}
