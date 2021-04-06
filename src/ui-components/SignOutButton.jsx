
import { useMsal } from "@azure/msal-react";
import { Link, Menu, MenuList, MenuButton, IconButton, MenuItem } from "@chakra-ui/react";
import { HamburgerIcon } from '@chakra-ui/icons'

export const SignOutButton = () => {
    const { instance } = useMsal();

    const handleLogout = () => {
        instance.logoutRedirect();
    }

    return (
        <div>
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
                    <MenuItem onClick={() => handleLogout()}>
                        Logout
                    </MenuItem>
                    <MenuItem>
                        <Link href="https://github.com/schmm2/mem-gaa" isExternal>
                            Github
                        </Link>
                    </MenuItem>
                </MenuList>
            </Menu>

        </div>
    )
};