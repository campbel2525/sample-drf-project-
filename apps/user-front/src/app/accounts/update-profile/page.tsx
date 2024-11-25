import { Box } from '@chakra-ui/react'

import UpdateProfileFetchComponent from '@/components/fetch/UpdateProfileFetchComponent'

export default function SignUpPage() {
  return (
    <Box mx="auto" width="100%" maxWidth="500px">
      <UpdateProfileFetchComponent />
    </Box>
  )
}
