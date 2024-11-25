import { Box } from '@chakra-ui/react'

import ServerErrorComponent from '@/components/common/ServerErrorComponent'
import ErrorMessageComponent from '@/components/messages/ErrorMessageComponent'
import ValidationErrorMessagesComponent from '@/components/messages/ValidationErrorMessagesComponent'
import UserListComponent from '@/components/UserListComponent'
import { fetchClient } from '@/utils/backend-client'

export default async function UserListFetchComponent() {
  let validationError = {}
  let errorMessage = ''

  const response = await fetchClient('GET', '/api/users/')
  const responseData = await response.json()
  if (!response.ok) {
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
      {responseData.data && (
        <Box padding="4" width="full" maxWidth="1200px" mx="auto">
          <UserListComponent users={responseData.data} />
        </Box>
      )}

      <Box p={8} maxWidth="400px">
        {Object.keys(validationError).length > 0 && (
          <ValidationErrorMessagesComponent validationError={validationError} />
        )}
        {errorMessage && <ErrorMessageComponent message={errorMessage} />}
      </Box>
    </>
  )
}
