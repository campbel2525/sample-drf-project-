import { Box } from '@chakra-ui/react'

import UserRetrieveFetchComponent from '@/components/fetch/UserRetrieveFetchComponent'

export default async function UserRetrievePage({ params }: { params: { id: string } }) {
  const { id } = params

  return (
    <>
      <Box padding="4" width="full" maxWidth="1200px" mx="auto">
        <UserRetrieveFetchComponent userId={Number(id)} />
      </Box>
    </>
  )
}
