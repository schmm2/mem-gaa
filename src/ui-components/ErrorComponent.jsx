import { Text } from "@chakra-ui/react"

export const ErrorComponent = ({error}) => {
    return <Text fontSize="lg">An Error Occurred: {error.errorCode}</Text>;
}