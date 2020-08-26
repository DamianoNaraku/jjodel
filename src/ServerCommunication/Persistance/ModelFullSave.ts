import {UniqueIdentifier} from '../Synchronization/ModelUpdateMessage';
import {ModelPiece} from '../../Model/modelPiece';
import {ViewRule} from '../../GuiStyles/viewpoint';
import {IVertex} from '../../guiElements/mGraph/Vertex/iVertex';
import {IEdge} from '../../guiElements/mGraph/Edge/iEdge';
import {IGraph} from '../../guiElements/mGraph/iGraph';

export class ModelFullSave{
  model: Map<UniqueIdentifier, ModelPiece>
  views: Map<UniqueIdentifier, ViewRule>
  vertex: Map<UniqueIdentifier, IVertex>
  edges: Map<IEdge, IEdge>
  graph: Map<UniqueIdentifier, IGraph>
}
// strategia: tutto viene serialiizzato in una map mono-livello senza ordine con key-value.
// ogni elemento ha le reference sostituite dall UID (non puoi navigare il modello serializzato)
// prima si decompongono tutti gli elementi deserializzandoli, poi si linkano sostituendo gli UID con il puntatore all'elem deserializzato.
