import { WelcomeName } from "./WelcomeName";
import { MenuComponent } from './MenuComponent';
import { NavBarContainer } from "./NavBarContainer";
import { HStack } from "@chakra-ui/react"
import Logo from "./Logo";
import './NavBar.css';

const NavBar = () => {
    return (
        <NavBarContainer className="navbar">
            <Logo />
            <HStack className="pointerOn" spacing="24px">
                <WelcomeName />
                <MenuComponent />
            </HStack>
        </NavBarContainer>
    );
};

export default NavBar;