import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import { Text } from "@chakra-ui/react"
import { Container, Center, Box } from "@chakra-ui/react"
import { SignInButton } from "../ui-components/SignInButton";

export function Home() {
  return (
    <>
      <UnauthenticatedTemplate>
        <Center color="white">
        <Box p={8} maxWidth="500px" minWidth="300px" borderWidth={1} borderRadius={8}>
            <center>
            <Text fontSize="lg" p={2}>
              Welcome
            </Text>
            <Text fontSize="md" p={2}>
              Please sign in
            </Text>         
            <SignInButton/>
            </center>
          </Box>
        </Center>
      </UnauthenticatedTemplate>
    </>
  );
}