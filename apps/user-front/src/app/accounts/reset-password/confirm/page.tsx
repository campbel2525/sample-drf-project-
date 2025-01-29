import { Box } from '@chakra-ui/react'

import ResetPasswordConfirmFormComponent from '@/components/forms/ResetPasswordConfirmFormComponent'

// サーバーコンポーネント
export default async function ResetPasswordConfirm({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const token = searchParams.token
  if (typeof token !== 'string') {
    return <p>URL が不正です。</p>
  }

  return (
    <Box mx="auto" width="100%" maxWidth="500px">
      <ResetPasswordConfirmFormComponent token={token} />
    </Box>
  )
}
