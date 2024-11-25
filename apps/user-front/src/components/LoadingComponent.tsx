'use client'

import { Flex, Spinner } from '@chakra-ui/react'

export default function LoadingComponent() {
  return (
    <Flex height="" alignItems="center" justifyContent="center">
      <Spinner size="xl" color="blue.500" />
    </Flex>
  )
}
