import { WelcomeName } from "./WelcomeName";
import { SignInSignOutButton } from "./SignInSignOutButton";
import { NavBarContainer } from "./NavBarContainer";
import { Flex } from "@chakra-ui/react"
import Logo from "./Logo";


const NavBar = () => {
    return (
        <div>
            <NavBarContainer>
                <Logo />
                <Flex
                    align="center"
                    justify="space-between"
                >
                    <WelcomeName />
                    <SignInSignOutButton />
                </Flex>
            </NavBarContainer>
        </div>
    );
};

export default NavBar;