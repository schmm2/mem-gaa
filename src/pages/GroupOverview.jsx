import { useEffect, useState } from "react";
import ReactFlow, {
    isNode,
    Controls,
    Handle
} from 'react-flow-renderer';
import dagre from 'dagre';
import { GrGroup } from "react-icons/gr"
import { Icon } from "@chakra-ui/react"
import { Spinner } from "@chakra-ui/react"

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
const graphApiResources = [
    {
        nodeId: 1,
        url: "deviceManagement/deviceEnrollmentConfigurations?$expand=assignments",
        displayName: "Device Enrollment Configuration"
    },
    {
        nodeId: 2,
        url: "deviceManagement/deviceConfigurations?$expand=assignments",
        displayName: "Device Configurations"
    },
    {
        nodeId: 3,
        url: "deviceManagement/deviceCompliancePolicies?$expand=assignments",
        displayName: "Device Compliance Policies"
    },
    {
        nodeId: 4,
        url: "deviceManagement/windowsAutopilotDeploymentProfiles?$expand=assignments",
        displayName: "Windows Autopilot Deployment Profiles"
    },
    {
        nodeId: 5,
        url: "deviceAppManagement/androidManagedAppProtections?$expand=assignments",
        displayName: "androidManagedAppProtections"
    },
    {
        nodeId: 6,
        url: "deviceAppManagement/iosManagedAppProtections?$expand=assignments",
        displayName: "iosManagedAppProtections"
    },
    {
        nodeId: 7,
        url: "deviceAppManagement/mobileAppConfigurations?$expand=assignments",
        displayName: "mobileAppConfigurations"
    },
    {
        nodeId: 8,
        url: "deviceManagement/groupPolicyConfigurations?$expand=assignments",
        displayName: "groupPolicyConfigurations"
    }
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
    const [isDataPrepared, setDataPrepared] = useState(false);

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
            type: 'default',
            data: { label: item.displayName },
            position: { x: 0, y: 0 },
        }
    }

    function buildGraphResourceNode(item) {
        return {
            id: item.nodeId,
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
        let groupIds = [];
        let resourceNodes = [];
        let resourceGroupNodes = [];
        let edges = [];

        await Promise.all(graphApiResources.map(async (graphApiResourceObject) => {
            //console.log(graphApiResourceObject);

            // get graph resource
            let graphResource = await callMsGraph(graphApiResourceObject.url);

            // only interested in the value property
            graphResource = graphResource.value;
            //console.log(graphResource);

            // check every resource item for assignments
            for (let g = 0; g < graphResource.length; g++) {
                let item = graphResource[g];
                //console.log(item);

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

                    // create graph resource node element
                    let newGraphResourceObject = {};
                    newGraphResourceObject = Object.assign(graphApiResourceObject);
                    newGraphResourceObject.nodeId = graphApiResourceObject.id + "-" + item.id;

                    let resourceGroupNode = buildGraphResourceNode(newGraphResourceObject);
                    resourceGroupNodes.push(resourceGroupNode);

                    // build edge to resourceGroupNode
                    let resourceGroupEdge = buildEdge(item.id, newGraphResourceObject.nodeId);
                    edges.push(resourceGroupEdge);
                }
            }
        }));

        // fetch Group information
        let groupPromises = [];
        console.log(groupIds);

        for (let groupIndex = 0; groupIndex < groupIds.length; groupIndex++) {
            let graphApiGroupUrl = "groups/" + groupIds[groupIndex];
            //console.log(graphApiGroupUrl);

            let graphPromise = await callMsGraph(graphApiGroupUrl);
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
        reactFlowElementsTmp = reactFlowElementsTmp.concat(resourceGroupNodes);

        const layoutedElements = getLayoutedElements(reactFlowElementsTmp, 'LR');

        setReactFlowElements(layoutedElements);

        console.log(groupNodes);
        console.log(resourceNodes);
        console.log(edges);

        setDataPrepared(true);
    }

    useEffect(() => {
        if (inProgress === InteractionStatus.None) {    
            fetchGraphData();
        }
        // eslint-disable-next-line
    }, [inProgress]);


    return (
        <MsalAuthenticationTemplate
            interactionType={InteractionType.Redirect}
            authenticationRequest={authRequest} 
            errorComponent={ErrorComponent}
            loadingComponent={Loading}
        >

            {
                isDataPrepared &&
                <div className="reactFlowContainer">
                    <ReactFlow elements={reactFlowElements} nodeTypes={nodeTypes} >
                        <Controls />
                    </ReactFlow>
                </div>
            }
            {
                !isDataPrepared &&
                <Spinner></Spinner>
            }

        </MsalAuthenticationTemplate>
    )
};

