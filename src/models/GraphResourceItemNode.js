class GraphResourceItemNode {
  constructor(displayName, graphId, connectedGraphResourceTypId) {
    this.id = graphId + "_" + connectedGraphResourceTypId;
    this.type = "output";
    this.data = {
      label: displayName,
      graphId: graphId,
      connectedGraphResourceTypId: connectedGraphResourceTypId
    };
    this.position = { x: 0, y: 0 };
  }
}

export default GraphResourceItemNode;