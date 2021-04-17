import React from "react"
import { Box, Text } from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@chakra-ui/react"

export default function Logo(props) {
  return (
    <Box {...props}>
      <Text fontSize="lg" fontWeight="bold" color="white">
        MEM - Group Assignment Analyzer
      </Text>
    </Box>
  )
}
