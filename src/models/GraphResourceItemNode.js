class GraphResourceItemNode {
  constructor(displayName, graphId, connectedGraphResourceTypId, intent) {
    this.id = connectedGraphResourceTypId + "_" + graphId + "_" + intent;
    this.type = "resourceItem";
    this.data = {
      label: displayName,
      graphId: graphId,
      intent: intent,
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