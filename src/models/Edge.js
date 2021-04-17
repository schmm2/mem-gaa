class Edge {
    constructor(sourceId, targetId) {
        this.id = "edge-" + sourceId + "-" + targetId;
        this.source = sourceId;
        this.target = targetId;
    }
}

export default Edge;