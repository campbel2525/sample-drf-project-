import { Box } from '@chakra-ui/react'

import UserListFetchComponent from '@/components/fetch/UserListFetchComponent'

export default async function UserIndexPage() {
  return (
    <>
      <Box padding="4" width="full" maxWidth="1200px" mx="auto">
        <UserListFetchComponent />
      </Box>
    </>
  )
}
