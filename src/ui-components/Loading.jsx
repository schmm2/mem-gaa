import { Text, Stack, Center, Box, Spinner } from "@chakra-ui/react"

export const Loading = (props) => {
    return (
        <Box>
            <Stack spacing="20px" textAlign="center" color="white">
                <Center>
                    <Spinner color="white" size="xl"></Spinner>
                </Center>
                <Text fontSize="lg" fontWeight="bold">{props.text}</Text>
            </Stack>
        </Box>
    )
}