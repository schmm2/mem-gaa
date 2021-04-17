
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { Link, Menu, MenuList, MenuButton, IconButton, MenuItem } from "@chakra-ui/react";
import { HamburgerIcon } from '@chakra-ui/icons'

export const MenuComponent = () => {
    const { instance } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const handleLogout = () => {
        instance.logoutRedirect();
    }

    return (
        <Menu>
            <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<HamburgerIcon />}
                size="md"
                variant="outline"
                color="white"
            />
            <MenuList>
                {
                    isAuthenticated &&
                    <MenuItem onClick={() => handleLogout()}>
                        Logout
                    </MenuItem>
                }
                <Link style={{ textDecoration: 'none' }} href="https://github.com/schmm2/mem-gaa/issues" isExternal>
                    <MenuItem>
                        Report Issues
                    </MenuItem>
                </Link>
                <Link style={{ textDecoration: 'none' }} href="https://github.com/schmm2/mem-gaa" isExternal>
                    <MenuItem>
                        Github
                    </MenuItem>
                </Link>
            </MenuList>
        </Menu>
    )
};