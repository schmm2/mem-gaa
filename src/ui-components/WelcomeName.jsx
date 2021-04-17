import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { Text } from "@chakra-ui/react";

export const WelcomeName = () => {
    const { accounts } = useMsal();
    const [name, setName] = useState(null);

    useEffect(() => {
        if (accounts.length > 0) {
            setName(accounts[0].name.split(" ")[0]);
        }
    }, [accounts]);

    if (name) {       
        return <Text fontSize="md" color="white">Welcome, {name}</Text>;
    } else {
        return null;
    }
};
