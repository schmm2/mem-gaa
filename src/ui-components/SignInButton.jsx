import { useMsal } from "@azure/msal-react";
import { Button } from "@chakra-ui/react";

export const SignInButton = () => {
    const { instance } = useMsal();

    const handleLogin = () => {
        instance.loginRedirect();
    }

    return (
        <div>
            <Button
                colorScheme="teal"
                size="md"
                onClick={() => handleLogin()}
            >
                Login
            </Button>
        </div>
    )
};