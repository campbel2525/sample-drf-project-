import { Box } from '@chakra-ui/react'

import UserUpdateFetchComponent from '@/components/fetch/UserUpdateFetchComponent'

export default async function UserUpdatePage({ params }: { params: { id: string } }) {
  const { id } = params

  return (
    <>
      <Box padding="4" width="full" maxWidth="1200px" mx="auto">
        <UserUpdateFetchComponent userId={Number(id)} />
      </Box>
    </>
  )
}
