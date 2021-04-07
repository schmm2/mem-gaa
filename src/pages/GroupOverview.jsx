import { useEffect, useState, useCallback } from "react";
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    removeElements,
    isNode,
    Controls,
    Handle
} from 'react-flow-renderer';
import dagre from 'dagre';
import { GrGroup } from "react-icons/gr"
import { Icon } from "@chakra-ui/react"

import './GroupOverview.css'

// Msal imports
import { MsalAuthenticationTemplate, useMsal } from "@azure/msal-react";
import { InteractionStatus, InteractionType } from "@azure/msal-browser";
import { loginRequest } from "../authConfig";

// Import
import { Loading } from "../ui-components/Loading";
import { ErrorComponent } from "../ui-components/ErrorComponent";
import { callMsGraph } from "../utils/MsGraphApiCall";

// Graph Direction
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

// Graph Node size
const nodeWidth = 172;
const nodeHeight = 36;

// Resources like configurations, apps...
const graphApiResourceUrls = [
    "deviceManagement/deviceEnrollmentConfigurations?$expand=assignments",
    "deviceManagement/deviceConfigurations?$expand=assignments",
    "deviceManagement/deviceCompliancePolicies?$expand=assignments",
    "deviceManagement/windowsAutopilotDeploymentProfiles?$expand=assignments",
    "deviceAppManagement/androidManagedAppProtections?$expand=assignments",
    "deviceAppManagement/iosManagedAppProtections?$expand=assignments",
    "deviceAppManagement/mobileAppConfigurations?$expand=assignments",
    "deviceManagement/groupPolicyConfigurations?$expand=assignments"
]

const getLayoutedElements = (elements, direction = 'TB') => {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction });

    elements.forEach((el) => {
        if (isNode(el)) {
            dagreGraph.setNode(el.id, { width: nodeWidth, height: nodeHeight });
        } else {
            dagreGraph.setEdge(el.source, el.target);
        }
    });

    dagre.layout(dagreGraph);

    return elements.map((el) => {
        if (isNode(el)) {
            const nodeWithPosition = dagreGraph.node(el.id);
            el.targetPosition = isHorizontal ? 'left' : 'top';
            el.sourcePosition = isHorizontal ? 'right' : 'bottom';

            // unfortunately we need this little hack to pass a slighltiy different position
            // to notify react flow about the change. More over we are shifting the dagre node position
            // (anchor=center center) to the top left so it matches the react flow node anchor point (top left).
            el.position = {
                x: nodeWithPosition.x - nodeWidth / 2 + Math.random() / 1000,
                y: nodeWithPosition.y - nodeHeight / 2,
            };
        }

        return el;
    });
};

export function GroupOverview() {
    const authRequest = {
        ...loginRequest
    };

    const { inProgress } = useMsal();
    //const [groups, setGroups] = useState(null);
    const [reactFlowElements, setReactFlowElements] = useState(null);

    function buildEdge(sourceId, targetId) {
        return { id: sourceId + "-" + targetId, source: sourceId, target: targetId }
    }


    function buildGroupNode(item) {
        return {
            id: item.id,
            type: 'group',
            data: { label: item.displayName },
            position: { x: 0, y: 0 },
        }
    };

    function buildResourceNode(item) {
        return {
            id: item.id,
            type: 'output',
            data: { label: item.displayName },
            position: { x: 0, y: 0 },
        }
    }

    const GroupNodeComponent = ({ data }) => {
        return (
            <div style={customNodeStyles}>
                <Icon as={GrGroup} />
                <div>{data.label}</div>
                <Handle
                    type="source"
                    position="right"
                    id="a"
                />
            </div>
        );
    };

    const nodeTypes = {
        group: GroupNodeComponent,
    };

    const customNodeStyles = {
        'padding': '10px',
        'borderRadius': '3px',
        'width': '150px',
        'fontSize': '12px',
        'color': '#222',
        'textAlign': 'center',
        'borderWidth': '1px',
        'borderStyle': 'solid',
        'backgroundColor': '#ffffff'
};

async function fetchGraphData() {
    let resourcePromises = [];
    graphApiResourceUrls.forEach((item, index) => {
        let graphPromise = callMsGraph(item);
        resourcePromises.push(graphPromise);
    })

    // wait till all resource data has been fetched
    let resourcesData = await Promise.all(resourcePromises);

    // only interested in the value property
    resourcesData = resourcesData.map(data => data.value);

    let groupIds = [];
    let resourceNodes = [];
    let edges = [];

    // check every resource for assignments
    for (let g = 0; g < resourcesData.length; g++) {
        for (let i = 0; i < resourcesData[g].length; i++) {
            let item = resourcesData[g][i];
            console.log(item);

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

                        // build edges for assignment
                        let edge = buildEdge(groupId, item.id);
                        edges.push(edge);
                    }
                }
                let resourceNode = buildResourceNode(item);
                resourceNodes.push(resourceNode);
            }
        }
    }

    let groupPromises = [];
    console.log(groupIds);

    // fetch Group information
    for (let groupIndex = 0; groupIndex < groupIds.length; groupIndex++) {
        let graphApiGroupUrl = "groups/" + groupIds[groupIndex];
        //console.log(graphApiGroupUrl);

        let graphPromise = callMsGraph(graphApiGroupUrl);
        groupPromises.push(graphPromise);
    }

    // wait for all data to arrive
    let groupData = await Promise.all(groupPromises);

    // build nodes
    let groupNodes = [];
    groupData.forEach(element => {
        let groupNode = buildGroupNode(element);
        groupNodes.push(groupNode);
    })

    // setResources(resourcesWithAssignments);
    // setGroups(groupData);

    /* console.log(groupData);
    console.log(resourcesData); */

    let reactFlowElementsTmp = groupNodes.concat(resourceNodes);
    reactFlowElementsTmp = reactFlowElementsTmp.concat(edges);

    const layoutedElements = getLayoutedElements(reactFlowElementsTmp, 'LR');

    setReactFlowElements(layoutedElements);

    console.log(groupNodes);
    console.log(resourceNodes);
    console.log(edges);
}

useEffect(() => {
    if (inProgress === InteractionStatus.None) {
        fetchGraphData();
    }
}, [inProgress]);


return (
    <MsalAuthenticationTemplate
        interactionType={InteractionType.Redirect}
        authenticationRequest={authRequest}
        errorComponent={ErrorComponent}
        loadingComponent={Loading}
    >

        {
            reactFlowElements && reactFlowElements.length > 0 &&
            <div className="reactFlowContainer">
                <ReactFlow elements={reactFlowElements} nodeTypes={nodeTypes} >
                    <Controls />
                </ReactFlow>
            </div>
        }

    </MsalAuthenticationTemplate>
)
};

