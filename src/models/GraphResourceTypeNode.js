class GraphResourceTypeNode {
    constructor(displayName, typeId, connectedGroupId, icon) {
        this.id = typeId + "-" + connectedGroupId;
        this.type = 'resourceType';      
        this.data = {
            label: displayName,
            typeId: typeId,
            connectedGroupId: connectedGroupId,
            icon: icon
        };
        this.position = { x: 0, y: 0 };
    }
}

export default GraphResourceTypeNode;