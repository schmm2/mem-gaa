import { Icon, Box } from "@chakra-ui/react"
import { DiWindows } from "react-icons/di";
import { GrApps, GrDocumentConfig,GrCompliance } from "react-icons/gr";
import { ImAirplane } from "react-icons/im";
import { AiOutlineFileProtect } from "react-icons/ai";

function renderIcon(iconName) {
    switch (iconName) {
        case 'protection':
            return <Icon as={AiOutlineFileProtect} />;
        case 'plane':
            return <Icon as={ImAirplane} />;
        case 'compliance':
            return <Icon as={GrCompliance} />;
        case 'configuration':
            return <Icon as={GrDocumentConfig} />;
        case 'apps':
            return <Icon as={GrApps} />;
        case 'windows':
            return <Icon as={DiWindows} />;
        default:
            return <span />;
    }
}


export const IconComponent = (props) => {
    return (
        <Box>
            {renderIcon(props.iconName)}
        </Box>
    );
}