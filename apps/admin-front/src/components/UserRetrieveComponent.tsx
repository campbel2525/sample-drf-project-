'use client'

import { Button, Box, Table, Tbody, Td, Tr } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

import { frontPaths } from '@/config/settings'
import type { User } from '@/types/models'

export default function UserRetrieveComponent({ user }: { user: User }) {
  const router = useRouter()

  return (
    <>
      {user && (
        <>
          <Table variant="simple">
            <Tbody>
              <Tr>
                <Td>id</Td>
                <Td>{user.id}</Td>
              </Tr>
              <Tr>
                <Td>Email</Td>
                <Td>{user.email}</Td>
              </Tr>
              <Tr>
                <Td>名前</Td>
                <Td>{user.name}</Td>
              </Tr>
              <Tr>
                <Td>アクティブ状態</Td>
                <Td>{user.is_active ? '有効' : '無効'}</Td>
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

          <Box p={8} maxWidth="400px" mx="auto" display="flex" justifyContent="center">
            <Button
              colorScheme="blue"
              onClick={() => {
                if (user) {
                  router.push(`${frontPaths.users}/${user.id}/edit`)
                }
              }}
            >
              編集へ
            </Button>
          </Box>
        </>
      )}
    </>
  )
}
