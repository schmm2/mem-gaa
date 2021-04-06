import NavBar from "./NavBar";
import { Box } from "@chakra-ui/react"

export const PageLayout = (props) => {
    return (
        <>
            <Box w="100vw" h="100vh" bgGradient="linear(to-tl, brand.900, brand.800)">
                <NavBar />
                <br />
                {props.children}
            </Box>
        </>
    );
};