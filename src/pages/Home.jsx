import { Redirect } from 'react-router-dom'
import { UnauthenticatedTemplate, AuthenticatedTemplate } from "@azure/msal-react";
import { Text, Center, Box, Stack } from "@chakra-ui/react"
import { SignInButton } from "../ui-components/SignInButton";

export function Home() {
  return (
    <>
      <UnauthenticatedTemplate>
        <Center minHeight="100vh" color="gray.600" textAlign="center">
          <Box backgroundColor="white" p={8} maxWidth="500px" minWidth="300px" borderWidth={1} borderRadius={8}>
            <Stack spacing="20px">
              <Text fontSize="lg" p={2}>
                Hello
              </Text>
              <Text fontSize="md" p={2}>
                Please sign in
              </Text>
              <SignInButton />
            </Stack>
          </Box>
        </Center>
      </UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <Redirect to='/groupoverview' />
      </AuthenticatedTemplate>
    </>
  );
}