import { useEffect, useState } from "react";
import ReactFlow, {
    isNode,
    Controls,
    Handle,
    MiniMap, 
} from 'react-flow-renderer';
import dagre from 'dagre';
import { GrGroup } from "react-icons/gr"
import { IconComponent } from "../ui-components/IconComponent";

// Theme and Design
import { Icon, Center, Text } from "@chakra-ui/react"
import './GroupOverview.css'

// Models
import Edge from "../models/Edge";
import GraphResourceItemNode from "../models/GraphResourceItemNode";
import GraphResourceTypeNode from "../models/GraphResourceTypeNode";
import GraphGroupNode from "../models/GroupNode";

// Msal imports
import { MsalAuthenticationTemplate, useMsal } from "@azure/msal-react";
import { InteractionStatus, InteractionType } from "@azure/msal-browser";
import { loginRequest } from "../authConfig";

// Other Import
import { Loading } from "../ui-components/Loading";
import { ErrorComponent } from "../ui-components/ErrorComponent";
import { callMsGraph } from "../utils/MsGraphApiCall";
import { checkObjectWithIdExistsInArray } from "../utils/CheckObjectWithIdExistsInArray";

// Graph Direction
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

// Graph Node size
const nodeWidth = 220;
const nodeHeight = 40;

// Resources like configurations, apps...
const graphApiResources = [
    {
        id: 1,
        url: "deviceManagement/deviceEnrollmentConfigurations?$expand=assignments",
        displayName: "Device Enrollment Configuration",
        icon: "configuration"
    },
    {
        id: 2,
        url: "deviceManagement/deviceConfigurations?$expand=assignments",
        displayName: "Device Configurations",
        icon: "configuration"
    },
    {
        id: 3,
        url: "deviceManagement/deviceCompliancePolicies?$expand=assignments",
        displayName: "Device Compliance Policies",
        icon: "compliance"
    },
    {
        id: 4,
        url: "deviceManagement/windowsAutopilotDeploymentProfiles?$expand=assignments",
        displayName: "Windows Autopilot Deployment Profiles",
        icon: "plane"
    },
    {
        id: 5,
        url: "deviceAppManagement/androidManagedAppProtections?$expand=assignments",
        displayName: "Android Managed App Protections",
        icon: "protection"
    },
    {
        id: 6,
        url: "deviceAppManagement/iosManagedAppProtections?$expand=assignments",
        displayName: "iOs Managed App Protections",
        icon: "protection"
    },
    {
        id: 7,
        url: "deviceAppManagement/mobileAppConfigurations?$expand=assignments",
        displayName: "Mobile App Configurations",
        icon: "apps"
    },
    {
        id: 8,
        url: "deviceManagement/groupPolicyConfigurations?$expand=assignments",
        displayName: "GroupPolicy Configurations",
        icon: "configuration"
    },
    {
        id: 9,
        url: "deviceAppManagement/mobileApps?$expand=assignments",
        displayName: "Mobile Apps",
        icon: "apps"
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
    const [reactFlowElements, setReactFlowElements] = useState(null);
    const [isDataPrepared, setDataPrepared] = useState(false);


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

    const GraphResourceItemNodeComponent = ({ data }) => {
        return (
            <div style={customNodeStyles}>
                <div>{data.label}</div>
                {
                    data.intent && data.intent !== "" &&
                    <Text>assignment: {data.intent}</Text>
                }
                <Handle
                    type="target"
                    position="left"
                    id="a"
                />
            </div>
        );
    };

    
    const GraphResourceTypeNodeComponent = ({ data }) => {
        return (
            <div style={customNodeStyles}>
                <IconComponent iconName={data.icon} />
                <div>{data.label}</div>
                <Handle
                    type="target"
                    position="left"
                    id="a"
                />
                <Handle
                    type="source"
                    position="right"
                    id="b"
                />
            </div>
        );
    };

    const nodeTypes = {
        group: GroupNodeComponent,
        resourceItem: GraphResourceItemNodeComponent,
        resourceType: GraphResourceTypeNodeComponent,
    };

    const customNodeStyles = {
        'padding': '10px',
        'borderRadius': '3px',
        'width': '180px',
        'fontSize': '12px',
        'color': '#222',
        'textAlign': 'center',
        'borderWidth': '1px',
        'borderStyle': 'solid',
        'backgroundColor': '#ffffff'
    };

    async function fetchGraphData() {
        let groupIds = [];
        let graphResourceTypeNodes = [];
        let graphResourceItemNodes = [];
        let edges = [];

        // Graph API Resource Types foreach
        await Promise.all(graphApiResources.map(async (graphApiResourceObject) => {
            //console.log(graphApiResourceObject);

            // get graph resource
            let graphResource = await callMsGraph(graphApiResourceObject.url);

            // only interested in the value property
            graphResource = graphResource.value;
            //console.log(graphResource);

            // Graph Resources foreach  
            for (let g = 0; g < graphResource.length; g++) {
                let resourceItem = graphResource[g];
                //console.log(resourceresourceItem);

                // check every resource resourceItem for assignments
                if (resourceItem.assignments) {
                    // Assignments foreach  
                    for (let a = 0; a < resourceItem.assignments.length; a++) {
                        let assignment = resourceItem.assignments[a];
                        console.log(assignment);

                        if (assignment.target && assignment.target.groupId) {
                            let groupId = assignment.target.groupId;
                            // console.log(groupId);

                            // found a new group
                            if (groupIds.indexOf(groupId) === -1) {
                                groupIds.push(groupId);
                            }

                            // build Graph Resource Type Node
                            let graphResourceTypeNodeId = graphApiResourceObject.id + "-" + groupId;
                            if (!checkObjectWithIdExistsInArray(graphResourceTypeNodeId, graphResourceTypeNodes)) {
                                // node not yet created
                                let newGraphResourceTypeNode = new GraphResourceTypeNode(
                                    graphApiResourceObject.displayName,
                                    graphApiResourceObject.id,
                                    groupId,
                                    graphApiResourceObject.icon
                                );
                                graphResourceTypeNodes.push(newGraphResourceTypeNode);

                                // create edge from Type to Group
                                let graphResourceToGroupEdge = new Edge(groupId, graphResourceTypeNodeId);
                                edges.push(graphResourceToGroupEdge);
                            } else {
                                // console.log(graphResourceTypeNodeId + "already exists");
                            }

                            // build Graph Resource Item Node
                            let newGraphResourceItem = new GraphResourceItemNode(
                                resourceItem.displayName,
                                resourceItem.id,
                                graphResourceTypeNodeId,
                                assignment.intent
                            );
                            graphResourceItemNodes.push(newGraphResourceItem);

                            // create Edge from Item to Type
                            let graphItemToResourceTypeEdge = new Edge(graphResourceTypeNodeId, newGraphResourceItem.id,);
                            edges.push(graphItemToResourceTypeEdge);
                        }
                    }
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
            let groupNode = new GraphGroupNode(element.id, element.displayName);
            groupNodes.push(groupNode);
        })

        // enable for debug
        
        console.log(graphResourceItemNodes);
        console.log(graphResourceTypeNodes);
        console.log(edges);
        console.log(groupNodes);
        

        let reactFlowElementsTmp = groupNodes.concat(graphResourceTypeNodes);
        reactFlowElementsTmp = reactFlowElementsTmp.concat(graphResourceItemNodes);
        reactFlowElementsTmp = reactFlowElementsTmp.concat(edges);

        const layoutedElements = getLayoutedElements(reactFlowElementsTmp, 'LR');

        setReactFlowElements(layoutedElements);
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
                    <ReactFlow
                        nodesDraggable={false}
                        elements={reactFlowElements}
                        nodeTypes={nodeTypes} >
                        <Controls />
                        <MiniMap />
                    </ReactFlow>
                </div>
            }
            {
                !isDataPrepared &&
                <Center minHeight="100vh">
                    <Loading text="Collecting Data"></Loading>
                </Center>
            }
        </MsalAuthenticationTemplate>
    )
};

