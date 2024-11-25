'use client'

import { Table, Tbody, Td, Tr, Checkbox, Input, Button, Box } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import ServerErrorComponent from '@/components/common/ServerErrorComponent'
import ErrorMessageComponent from '@/components/messages/ErrorMessageComponent'
import ValidationErrorMessagesComponent from '@/components/messages/ValidationErrorMessagesComponent'
import { frontPaths } from '@/config/settings'
import type { User } from '@/types/models'
import type { UserUpdateRequest } from '@/types/requests/user-requests'
import { client } from '@/utils/front-client'

type Props = {
  user: User
}

export default function UserUpdateFormComponent({ user }: Props) {
  const router = useRouter()

  const [errorMessage, setErrorMessage] = useState<string>('')
  const [validationError, setValidationError] = useState<Record<string, string[]>>({})
  const [inputData, setInputData] = useState<UserUpdateRequest>({
    email: user.email,
    name: user.name,
    is_active: user.is_active,
    password: null,
  })
  const [userUpdateResponse, setUserUpdateResponse] = useState<Response | null>(null)
  const [userDestroyResponse, setUserDestroyResponse] = useState<Response | null>(null)

  const handleUserUpdate = async () => {
    const response = await client('PUT', `/api/users/${user.id}/`, null, inputData)
    setUserUpdateResponse(response)
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
    router.push(`${frontPaths.users}/${user.id}`)
    router.refresh()
    return
  }

  const handleUserDestroy = async () => {
    const response = await client('DELETE', `/api/users/${user.id}/`)
    setUserDestroyResponse(response)
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
    router.push(`${frontPaths.users}`)
    router.refresh()
    return
  }

  if (userUpdateResponse?.status === 500) {
    return <ServerErrorComponent />
  }

  if (userDestroyResponse?.status === 500) {
    return <ServerErrorComponent />
  }

  return (
    <>
      {user && (
        <>
          <Box maxWidth="100%">
            <Table variant="simple">
              <Tbody>
                <Tr>
                  <Td>id</Td>
                  <Td>{user.id}</Td>
                </Tr>
                <Tr>
                  <Td>Email</Td>
                  <Td>
                    <Input
                      value={inputData.email}
                      onChange={(e) =>
                        setInputData({ ...inputData, email: e.target.value })
                      }
                    />
                  </Td>
                </Tr>
                <Tr>
                  <Td>名前</Td>
                  <Td>
                    <Input
                      value={inputData.name}
                      onChange={(e) =>
                        setInputData({ ...inputData, name: e.target.value })
                      }
                    />
                  </Td>
                </Tr>
                <Tr>
                  <Td>アクティブ状態</Td>
                  <Td>
                    <Checkbox
                      isChecked={inputData.is_active}
                      onChange={(e) =>
                        setInputData({ ...inputData, is_active: e.target.checked })
                      }
                    ></Checkbox>
                  </Td>
                </Tr>
                <Tr>
                  <Td>パスワード</Td>
                  <Td>
                    <Input
                      type="password"
                      value={inputData.password || ''}
                      onChange={(e) =>
                        setInputData({ ...inputData, password: e.target.value })
                      }
                    />
                  </Td>
                </Tr>
                <Tr>
                  <Td>作成日</Td>
                  <Td>{user.created_at}</Td>
                </Tr>
                <Tr>
                  <Td>更新日</Td>
                  <Td>{user.updated_at}</Td>
                </Tr>
              </Tbody>
            </Table>

            <Box
              p={8}
              maxWidth="400px"
              mx="auto"
              display="flex"
              justifyContent="center"
            >
              <Button
                width="full"
                mt={4}
                mr={2}
                type="submit"
                onClick={handleUserUpdate}
              >
                修正
              </Button>
              <Button
                width="full"
                mt={4}
                ml={2}
                type="button"
                onClick={handleUserDestroy}
              >
                削除
              </Button>
            </Box>

            <Box p={8} maxWidth="400px">
              {Object.keys(validationError).length > 0 && (
                <ValidationErrorMessagesComponent validationError={validationError} />
              )}
              {errorMessage && <ErrorMessageComponent message={errorMessage} />}
            </Box>
          </Box>
        </>
      )}
    </>
  )
}
