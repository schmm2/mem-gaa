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
    this.style = {
      background: 'white',
      color: '#333',
      border: '1px solid #222138',
    }
  }
}

export default GraphResourceItemNode;