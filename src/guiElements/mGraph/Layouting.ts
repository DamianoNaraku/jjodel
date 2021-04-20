import { Edge, AnimationOptions, BoundingBox, ChosenLabelValues, ChosenNodeValues, ClusterOptions, Color, Data,
  DataInterfaceEdges, DataInterfaceNodes, DataSetEdges, DataSetNodes, DataViewEdges, DataViewNodes, DirectionType,
  DOMutil, data, Hammer, keycharm, util, // weird ones, are they namespaces? subfiles?
  EasingFunction, EdgeOptions, FitOptions, FocusOptions, FontOptions, IdType, Image, ImagePadding,
  LocaleMessages, Locales, MoveToOptions, Network, network, NetworkEvents, Node, NodeChosen,
  NodeChosenLabelFunction, NodeChosenNodeFunction, NodeOptions, OpenClusterOptions, Options, OptionsScaling,
  OptionsShadow, Position, SelectionOptions, TimelineAnimationType, ViewPortOptions, DataSet, DataView, Queue} from "vis-network";
import {Dictionary, EdgePoint, GraphPoint, GraphSize, IEdge, IGraph, IVertex, ModelPiece, U} from '../../common/Joiner';

export class Layouting{
  private static maxID: number = 1;
  public static scaleFactor = 1;
  // private static layouting: Layouting;
  // nodes: {id: number, label: string}[] = [];
  // edges: {from: number, to: number}[] = [];
  data: Data;
  stabilizationSteps: number;
  graphHtml: Element;
  optionsHtml: Element;

  optionsDefault: {
    layout: {
      randomSeed: number | string
      improvedLayout: boolean,
      clusterThreshold: number,
      hierarchical: {
        enabled: boolean,
        levelSeparation: number,
        nodeSpacing: number,
        treeSpacing: number,
        blockShifting: boolean,
        edgeMinimization: boolean,
        parentCentralization: boolean,
        direction: 'UD' | 'DU' | 'LR' | 'RL',
        sortMethod: 'hubsize' | 'directed',
        shakeTowards: 'leaves' | 'roots'
      }
    } // https://visjs.github.io/vis-network/docs/network/layout.html
    interaction:{
      dragNodes: boolean,
      dragView: boolean,
      hideEdgesOnDrag: boolean,
      hideEdgesOnZoom: boolean,
      hideNodesOnDrag: boolean,
      hover: boolean,
      hoverConnectedEdges: boolean,
      keyboard: {
        enabled: boolean,
        speed: {x: number, y: number, zoom: number},
        bindToWindow: boolean
      },
      multiselect: boolean,
      navigationButtons: boolean,
      selectable: boolean,
      selectConnectedEdges: boolean,
      tooltipDelay: number,
      zoomView: boolean
    },
    manipulation: {
      enabled: boolean,
      initiallyActive: boolean,
      addNode: boolean,
      addEdge: boolean,
      editNode: Function, // "This function will be called like the addNode function with the node's data and a callback function."
      editEdge: boolean,
      deleteNode: boolean,
      deleteEdge: boolean,
      controlNodeStyle: unknown // "all node options are valid." WTF THAT MEANS???
    },
    physics:{
      enabled: boolean,
      barnesHut: {
        theta: number,
        gravitationalConstant: number,
        centralGravity: number,
        springConstant: number,
        springLength: number,
        damping: number,
        avoidOverlap: number
      },
      forceAtlas2Based: {
        theta: number,
        gravitationalConstant: number,
        centralGravity: number,
        springConstant: number,
        springLength: number,
        damping: number,
        avoidOverlap: number
      },
      repulsion: {
        centralGravity: number,
        springLength: number,
        springConstant: number,
        nodeDistance: number,
        damping: number
      },
      hierarchicalRepulsion: {
        centralGravity: number,
        springLength: number,
        springConstant: number,
        nodeDistance: number,
        damping: number,
        avoidOverlap: number
      },
      maxVelocity: number,
      minVelocity: number,
      solver: 'barnesHut' | 'repulsion' | 'hierarchicalRepulsion' | 'forceAtlas2Based',
      stabilization: {
        enabled?: boolean,
        iterations?: number,
        updateInterval?: number,
        onlyDynamicEdges?: boolean,
        fit?: boolean
      },
      timestep: number,
      adaptiveTimestep: boolean,
      wind: { x: number, y: number }
    },
    nodes?: {
      shape?: string
      scaling?: {
        min?: number,
        customScalingFunction?: (min:number, max:number, total:number, value:number) => number,
      },
    },
    edges?: {
      scaling?: {
        min?: number,
        customScalingFunction?: (min:number, max:number, total:number, value:number) => number,
      },
    }
  };
  net: Network;
  isRunning: boolean = false;
  myOptions: {
    edgePointMode: 'delete' | 'vertex' | 'ignore' | 'relative';
  };
  graph: IGraph;
  htmlg: HTMLElement;
  id: string;
  sid: string; // short id
  nodeExampleCompiler: Node;
  styleEditorOnLayoutStart: () => void;
  styleEditorOnLayoutEnd: () => void;

  public constructor(graph: IGraph) {
    this.id = U.getID();
    U.setID(this.id, this);
    this.graph = graph;
    this.stabilizationSteps = 10;
    this.data = {
      nodes: [],
      edges: []
    };

    this.myOptions = {
      edgePointMode: 'vertex'
    };

    this.optionsDefault = {
      layout: {
        randomSeed: undefined,
        improvedLayout: true,
        clusterThreshold: 1,
        // clusterThreshold: 150 è il limite default per applicare improvedLayout
        // (pre-algoritmo per trovare un buon punto di partenza da cui uscirà un miglior minimo locale)
        hierarchical: {
          enabled: false,
          levelSeparation: 150,
          nodeSpacing: 100,
          treeSpacing: 200,
          blockShifting: true,
          edgeMinimization: true,
          parentCentralization: true,
          direction: 'UD',
          sortMethod: 'hubsize',
          shakeTowards: 'leaves'
        }
      },
      interaction:{
        dragNodes:true,
        dragView: true,
        hideEdgesOnDrag: false,
        hideEdgesOnZoom: false,
        hideNodesOnDrag: false,
        hover: false,
        hoverConnectedEdges: true,
        keyboard: {
          enabled: false,
          speed: {x: 10, y: 10, zoom: 0.02},
          bindToWindow: true
        },
        multiselect: false,
        navigationButtons: false,
        selectable: true,
        selectConnectedEdges: true,
        tooltipDelay: 300,
        zoomView: true
      },
      manipulation: {
        enabled: false,
        initiallyActive: false,
        addNode: true,
        addEdge: true,
        editNode: undefined,
        editEdge: true,
        deleteNode: true,
        deleteEdge: true,
        controlNodeStyle:{
          // all node options are valid (WTF THAT MEANS???)
        }
      },
      physics:{
        enabled: true,
        barnesHut: {
          theta: 0.5,
          gravitationalConstant: -1, //-2000,
          centralGravity: 1000,
          springLength: 10, //95,
          springConstant: 0.04,
          damping: 0.2, //0.09,
          avoidOverlap: 1
        },
        forceAtlas2Based: {
          theta: 0.5,
          gravitationalConstant: -100,
          centralGravity: 0.01,
          springConstant: 0.08,
          springLength: 100,
          damping: 0.4,
          avoidOverlap: 0
        },
        repulsion: {
          centralGravity: 0.2,
          springLength: 200,
          springConstant: 0.05,
          nodeDistance: 100,
          damping: 0.09
        },
        hierarchicalRepulsion: {
          centralGravity: 0.0,
          springLength: 100,
          springConstant: 0.01,
          nodeDistance: 120,
          damping: 100, //0.09,
          avoidOverlap: 0
        },
        maxVelocity: 0.001,// 50,
        minVelocity: 0.0001, // 0.1
        solver: 'forceAtlas2Based',// 'barnesHut',
        stabilization: {
          enabled: true,
          iterations: Number.MAX_SAFE_INTEGER,
          updateInterval: 15,
          onlyDynamicEdges: false,
          fit: true
        },
        timestep: 0.5,
        adaptiveTimestep: true,
        wind: { x: 0, y: 0 }
      },
      /*
      nodes: {
        shape: "square",
        scaling: {
          min: 0,
          customScalingFunction: function (min, max, total, value) { return value / Layouting.scaleFactor; },
        },
      },
      edges: {
        scaling: {
          min: 0,
          customScalingFunction: function (min, max, total, value) { return value / Layouting.scaleFactor; },
        },
      }*/

    };

    delete this.optionsDefault.manipulation; // editNode is giving problems
    (this.optionsDefault as any).configure = { // c'è negli esempi, ma non nella documentazione
      filter: function (option, path) {
        if (path.indexOf("physics") !== -1) return true;
        if (path.indexOf("smooth") !== -1 || option === "smooth") return true;
        return false;
      },
      container: $('#visOptions')[0],
    };
    const container: HTMLElement = this.htmlg = $('#' + this.graph.model.getPrefix() + '_visGraph')[0];
    this.net = new Network(container, {}, {});
    this.net.on('stabilized', () => { this.onLayoutEnd(); } );
    // this.net.on('stabilizationIterationsDone', () => { this.onStabilizationStep(); } );
    this.net.on('stabilizationProgress', () => { this.onStabilizationStep(); } );

    /*
    this.net.startSimulation();
    this.net.stopSimulation();// ferma senza stabilizzare?, ma chiama l'evento stabilized.
    this.net.stabilize(); // stabilizza entro N iterazioni
    */

  }

  public setStyleEditorBackEvents(styleEditorOnLayoutStart: () => void, styleEditorOnLayoutEnd: () => void): void {
    this.styleEditorOnLayoutStart = styleEditorOnLayoutStart;
    this.styleEditorOnLayoutEnd = styleEditorOnLayoutEnd;
  }

  private onLayoutEnd(): void{
    const positions: Dictionary<string, Position> = this.onStabilizationStep();
    const manualStop = !this.isRunning;
    if (!manualStop) return;
    if (this.styleEditorOnLayoutEnd) this.styleEditorOnLayoutEnd();
    console.log('vis layout stopped:', positions);
  }

  private positionScaleFactor(p: Position, clone: boolean = false): Position {
    p = clone ? U.cloneObj<Position>(p) as Position: p;
    p.x = p.x * Layouting.scaleFactor;
    p.y = p.y * Layouting.scaleFactor;
    return p; }

  private onStabilizationStep(): Dictionary<string, Position> {
//    console.log('vis stabilization step');
    let positions: Dictionary<string, Position> = this.net.getPositions();
    let key: string;
    for (key in positions) {
      const vertex: IVertex = IVertex.getByID(+key);
      let position: Position = positions[key];
      position = this.positionScaleFactor(position);
      const ep: EdgePoint = EdgePoint.getByID(+key);
      const newPos: GraphPoint = new GraphPoint(position.x, position.y);
      // U.pe ( !!(ep && vertex), 'duplicate id', key, ep, vertex);
      // U.pe (!ep && !vertex, 'invalid id', key);
      /// todo: digli che l'evento viene da autolayout e setta onvertexmove se non viene da autolayout
      if (vertex) vertex.moveTo(newPos, false, false, true);
      if (!vertex && ep) ep.moveTo(newPos, false, true);
    }
    // todo: springlength e grav constant devi precompilarle in base alla size del grafo.
    // poi devi capire se cresce lineare, al quadrato, o come...
    return positions;
  }

  public onVertexMove(v: IVertex): void {
    // todo: che devo fare con edge che creano nuovi edgepoint dopo set data? mi sa che devo settare gli edge dinamicamente e tenermi i vertici selezionati al momento dello start
    if (!this.isRunning) return;
    const node: Node = this.vertexToVis(v);
    if (!node) return;
    this.stop();
    this.start();
    return;
    const size: GraphSize = v.getSize();
    node.size = (size.w * size.h === 0) ? 0 : size.w; // Math.max(size.w, size.h);
    node['heightConstraint'] = size.h;
    node.x = size.x;
    node.y = size.y;
  }

  public prepareStartData(): void {
    let vertexes: IVertex[] = this.graph.getVertexSelection();
    if (!vertexes || !vertexes.length) vertexes = this.graph.getAllVertex();
    this.clearLayout();
    this.addToLayout(vertexes, false);
    this.data.edges = this.prepareEdgeData(); // setta edge ed edgepoint nel data.nodes
    this.data = this.applyScaleFactor(Layouting.scaleFactor, false);
  }

  private vertexMap: Dictionary<number, {vertex: IVertex, visNode: Node}>
  private linkVisVertex(v: IVertex, node: Node) { this.vertexMap[v.id] = {vertex: v, visNode: node}; }
  public vertexToVis(v: IVertex): Node { return this.vertexMap[v.id] && this.vertexMap[v.id].visNode; }
  public visToVertex(v: Node): IVertex { return this.vertexMap[v.id] && this.vertexMap[v.id].vertex; }

  private clearLayout(): void {
    this.vertexMap = {};
    this.data.nodes = [];
  }

  public addToLayout(vertexes: IVertex[], restart: boolean): void {
    if (restart) return this.restart();
    for (const v of vertexes){
      if (!v.autoLayout) continue;
      let node: Node = this.vertexToVis(v);
      if (node) return; // already exists
      node = {};
      node.id = v.id;
      this.linkVisVertex(v, node);
      const size: GraphSize = v.getSize();
      // https://almende.github.io/vis/docs/network/nodes.html deprecated, but best documentation
      node.label = v.logic().name; // v.logic().printableNameshort(10);
      node.shape = 'square'; // esiste anche "box" ma solo con label inside, e prende la size dalla label...
      node.size = (size.w * size.h === 0) ? 0 : size.w; // Math.max(size.w, size.h);
      node['heightConstraint'] = size.h;
      node.x = size.x;
      node.y = size.y;
      node.font = {};
      node.font.size = 100;
      node.font.face = 'arial';
      node.font.color = '#000000';
      (this.data.nodes as Node[]).push(node);
    }
    this.prepareEdgeData();
  }

  public restart(): void{
    this.start();
    this.stop();
  }
  public removeFromLayout(vertexes: IVertex[], restart: boolean): void{
    if (restart) return this.restart();
    for (const v of vertexes){
      if (v.autoLayout) continue;
      const node: Node = this.vertexToVis(v);
      U.arrayRemoveAll(this.data.nodes as Node[], node);
      delete this.vertexMap[v.id]; }
    this.prepareEdgeData();
  }

  private getCurrentVertexes(): IVertex[] {
    let v: IVertex[] = [];
    for (let id in this.vertexMap) { v.push(this.vertexMap[id].vertex); }
    return v; }

  private applyScaleFactor(factor: number, clone: boolean = false): Data {
    const data: Data = clone ? U.cloneObj(this.data) : this.data;

    for (let node of data.nodes as Node[]) {
      console.log('vis node loop', node, data);
      // node.scaling ??
      node.x = node.x && node.x / factor;
      node.y = node.y && node.y / factor;
      node.size = node.size && node.size / factor;
      node['heightConstraint'] = node['heightConstraint'] && node['heightConstraint'] / factor;
      if (node.font) { node.font['size'] = node.font['size'] && node.font['size'] / factor; }
    }
    for (let edge of data.edges as Edge[]) {
      edge.length = edge.length  && edge.length / factor;
      edge.width = edge.width && edge.width / factor;
      edge.hoverWidth = edge.hoverWidth && edge.hoverWidth / factor;
      edge.selectionWidth = edge.selectionWidth && edge.selectionWidth / factor;
    }
    return data;
  }

  private prepareEdgeData(): Edge[] {
    let visedges: Edge[];
    const vertexes: IVertex[] = this.getCurrentVertexes();

    let edgesArr: IEdge[] = null; // this.graph.getEdgeSelection();
    if (!edgesArr || !edgesArr.length) {
      const edgeset: Set<IEdge> = new Set();
      vertexes.forEach( (v: IVertex) => { U.SetMerge(true, edgeset, v.edgesEnd, v.edgesStart); });
      edgesArr = [...edgeset];
    }

    // accetto solo edge che hanno start ed end nella selezione, e che NON hanno length 0 (start = end senza midpoint forzati)
    edgesArr = edgesArr.filter(
      (e: IEdge) => { return this.vertexMap[e.start.id] && this.vertexMap[e.end.id] && !(e.midNodes.length === 0 && e.start === e.end); }
      );
    visedges = edgesArr.map((e: IEdge) => { return {from: e.start.id, to: e.end.id, id: e.id}; } );

    switch (this.myOptions.edgePointMode) {
      default: U.pe(true, 'unexpected switch layouting.edgepointMode:', this.myOptions.edgePointMode); break;
      case 'ignore':
      case 'relative': break;
      case 'vertex':
        const midPoints: EdgePoint[] = [];
        edgesArr.forEach((e: IEdge) => { U.ArrayMerge(midPoints, e.midNodes); });
        const midPointsvis: Node[] = midPoints.map((ep: EdgePoint) => {
          const node: Node = {} as any;
          const size: GraphSize = ep.getSize();
          // https://almende.github.io/vis/docs/network/nodes.html deprecated, but best documentation
          node.id = ep.id;
          node.shape = 'square'; // esiste anche "box" ma solo con label inside, e prende la size dalla label...
          node.label = '°';
          node.size = (size.w * size.h === 0) ? 0 : size.w; // Math.max(size.w, size.h);
          node['heightConstraint'] = size.h;
          node.x = size.x;
          node.y = size.y;
          return node as any; } );
        U.ArrayMerge(this.data.nodes as Node[], midPointsvis);
        break;
      case 'delete':
        Object.values(EdgePoint.all).forEach( (ep: EdgePoint) => { ep.detach(); });
        break;
    }

    return visedges;
  }

  public start(): void {
    this.prepareStartData();
    // this.nodeExampleCompiler.shape;
    // this.nodeExampleCompiler.shapeProperties.
    this.net.setOptions(this.optionsDefault);
    console.log('vis.data:', this.data);
    this.net.setData(this.data);
    this.isRunning = true;
    if (this.styleEditorOnLayoutStart) this.styleEditorOnLayoutStart();
    // this.net.startSimulation();
  }

  public stop(): void {
    this.net.stopSimulation();
  }

  public stabilize(steps: number = null, renewData: boolean = true): void {
    if (renewData) {
      this.net.setOptions(this.optionsDefault);
      this.prepareStartData();
      this.net.setData(this.data);
    }
    this.net.stabilize(steps === null ? steps : this.stabilizationSteps);
  }

  public setOption(key: string, value: any) {
    const keypath: string[] = key.split('.');
    let opt: any = this.optionsDefault;
    switch(key) {
      default:
        for (let i = 0; i < keypath.length - 1; i++) {
          opt = opt[keypath[i]];
          console.log('key2 subpart: ', keypath[i], '->', opt);
        }
        opt[keypath[keypath.length - 1]] = value;
        console.log('key2 END: setting ', keypath[keypath.length - 1], '->', value);
        break;
    }
  }
  public getOption(key: string) {
    const keypath: string[] = key.split('.');
    let opt: any = this.optionsDefault;
    let ret: any;
    switch(key) {
      default:
        for (let i = 0; i < keypath.length - 1; i++) {
          opt = opt[keypath[i]];
          // console.log('key2 subpart: ', keypath[i], '->', opt);
        }
        ret = opt[keypath[keypath.length - 1]];
        //console.log('key2 END: ', keypath[keypath.length - 1], '->', ret);
        break;
    }
  return ret;
  }
}
