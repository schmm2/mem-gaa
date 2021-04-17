class GraphGroupNode {
    constructor(id, displayName) {
        this.id = id;
        this.type = "group";
        this.data = {
            label: displayName,
        };
        this.position = { x: 0, y: 0 };
    }
}

export default GraphGroupNode;

