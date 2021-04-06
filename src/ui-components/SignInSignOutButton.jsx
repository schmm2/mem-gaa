import { useIsAuthenticated } from "@azure/msal-react";
import { SignOutButton } from "./SignOutButton";

export const SignInSignOutButton = () => {
    const isAuthenticated = useIsAuthenticated();

    if (isAuthenticated) {
        return <SignOutButton />;
    } else{
        return <span/>
    }
}