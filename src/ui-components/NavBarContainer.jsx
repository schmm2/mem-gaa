import React from "react"
import { Flex } from "@chakra-ui/react"

export const NavBarContainer = ({ children, ...props }) => {
    return (
        <Flex
            as="nav"
            align="center"
            justify="space-between"
            wrap="wrap"
            w="100%"
            p={4}
            {...props}
        >
            {children}
        </Flex>
    )
}


