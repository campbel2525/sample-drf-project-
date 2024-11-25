import { Box } from '@chakra-ui/react'

import UpdatePasswordFormComponent from '@/components/forms/UpdatePasswordFormComponent'

export default function SignUpPage() {
  return (
    <Box mx="auto" width="100%" maxWidth="500px">
      <UpdatePasswordFormComponent />
    </Box>
  )
}
