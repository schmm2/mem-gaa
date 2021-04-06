import { useEffect, useState } from "react";

// Msal imports
import { MsalAuthenticationTemplate, useMsal } from "@azure/msal-react";
import { InteractionStatus, InteractionType } from "@azure/msal-browser";
import { loginRequest } from "../authConfig";

// Import
import { Loading } from "../ui-components/Loading";
import { ErrorComponent } from "../ui-components/ErrorComponent";
import { callMsGraph } from "../utils/MsGraphApiCall";

// Material-ui imports
import Paper from "@material-ui/core/Paper";

// Resources like configurations, apps...
const graphApiResourceUrls = [
    "deviceManagement/deviceEnrollmentConfigurations?$expand=assignments",
    "deviceManagement/deviceConfigurations?$expand=assignments",
]

const GroupOverviewContent = () => {
    const { inProgress } = useMsal();
    const [groups, setGroups] = useState(null);
    const [graphResources, setResources] = useState(null);

    async function fetchGraphData() {
        let promises = [];
        graphApiResourceUrls.forEach((item, index) => {
            let graphPromise = callMsGraph(item);
            promises.push(graphPromise);
        })

        // wait till all data has been fetched
        let graphData = await Promise.all(promises);

        // only interested in the value property
        graphData = graphData.map(data => data.value);

        let groupIds = [];

        // check every resource for assignments
        for (let g = 0; g < graphData.length; g++) {
            for (let i = 0; i < graphData[g].length; i++) {
                let item = graphData[g][i];
                // console.log(item);

                if (item.assignments) {
                    for (let a = 0; a < item.assignments.length; a++) {
                        let assignment = item.assignments[a];
                        // console.log(assignment);

                        if (assignment.target && assignment.target.groupId) {
                            let groupId = assignment.target.groupId;
                            // console.log(groupId);
                            if (groupIds.indexOf(groupId) === -1) {
                                groupIds.push(groupId);
                            }
                        }
                    }
                }
            }
        }

        console.log(groupIds);

        console.log(graphData);
    }

    useEffect(() => {
        if (inProgress === InteractionStatus.None) {
            fetchGraphData();
        }
    }, [inProgress]);

    return (
        <Paper>
            <p>hello</p>
        </Paper>
    );
};

export function GroupOverview() {
    const authRequest = {
        ...loginRequest
    };

    return (
        <MsalAuthenticationTemplate
            interactionType={InteractionType.Popup}
            authenticationRequest={authRequest}
            errorComponent={ErrorComponent}
            loadingComponent={Loading}
        >
            <GroupOverviewContent />
        </MsalAuthenticationTemplate>
    )
};