import { WelcomeName } from "./WelcomeName";
import { SignInSignOutButton } from "./SignInSignOutButton";
import { NavBarContainer } from "./NavBarContainer";
import { HStack } from "@chakra-ui/react"
import Logo from "./Logo";
import './NavBar.css';

const NavBar = () => {
    return (
        <NavBarContainer className="navbar">
            <Logo />
            <HStack className="menu" spacing="24px">
                <WelcomeName />
                <SignInSignOutButton />
            </HStack>
        </NavBarContainer>
    );
};

export default NavBar;