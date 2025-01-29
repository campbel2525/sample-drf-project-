// src/components/UserList.tsx (クライアントコンポーネント)

'use client'

import { Box, SimpleGrid } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

import type { User } from '@/types/models'

export default function UserListComponent({ users }: { users: User[] }) {
  const router = useRouter()

  return (
    <SimpleGrid columns={{ base: 2, md: 3, lg: 4, xl: 5 }} spacing="4">
      {users.map((user) => (
        <Box
          key={user.id}
          p="5"
          shadow="md"
          borderWidth="1px"
          onClick={() => router.push(`/users/${user.id}`)} // ページ遷移の実装
        >
          <p>{user.name}</p>
        </Box>
      ))}
    </SimpleGrid>
  )
}
