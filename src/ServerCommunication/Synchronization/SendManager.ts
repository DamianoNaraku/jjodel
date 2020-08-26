import {IClass, ModelUpdateMessage, U} from '../../common/Joiner';
import jqXHR = JQuery.jqXHR;
import ErrorTextStatus = JQuery.Ajax.ErrorTextStatus;
import {UniqueIdentifier} from './ModelUpdateMessage';

// NB: se nel receiveManager ricevo un ordine di update di un ModelPieceID non esistente, devo bufferarlo.
// potrebbe essere una inversione di ordine dei messaggi nello strato di rete.
// NB: se al server arrivano 2 renameModelPiece nell'ordine inverso, devo tenere traccia del timestamp,
// e se l'ultimo rename sul mp è più recente di quello appena arrivato lo ignoro. (idempotenza, non cambia l'ordine dei messaggi)
// todo: perdi la compatibilità con eCore nel salvataggio. permetterebbe di inserire commenti, riferimenti circolari in m1 e altro.
//  poi posso sempre salvare sia in eCore che nel mio nuovo formato.

export class SendManager {
  public static manager = new SendManager("", 5000);
  private serverAdress: string;
  private timeout: number;

  private constructor(serverAdress: string, timeout: number){
    // U.pe(!serverAdress, "fill server adress before testing");
    this.serverAdress = serverAdress;
    this.timeout = timeout;
  }


  public update(uid: UniqueIdentifier, fieldName: string, newValue: any) {
    const msg: ModelUpdateMessage = new ModelUpdateMessage(uid, fieldName, newValue);
    const callback = () => {};
    let request: JQuery.jqXHR = $.post( this.serverAdress, msg, callback);
    request = $.ajax({
      url: this.serverAdress,
      type: "POST",
      dataType: "json",
      timeout: this.timeout,
      success: function(response) { setTimeout( () => SendManager.manager.update(uid, fieldName, newValue)); },
      error: function(xmlhttprequest: jqXHR, textstatus: ErrorTextStatus, message: string) {
        // 'success' | 'notmodified' | 'nocontent';
        switch (textstatus) {
          default: U.pe(true, 'unexpected return code from ajax request:', textstatus, msg); break;
          case 'timeout':

            break;
          case 'error': U.pe(true, 'undefined error after synch server request send', msg); break;
          case 'abort': U.pe(true, 'undefined abort after synch server request send', msg); break;
          case 'parsererror': U.pe(true, 'undefined abort after synch server request send', msg); break;
        }
        if(textstatus==="timeout") {
          alert("got timeout");
        } else {
          alert(textstatus);
        }
      }
    });​
    request.state()
  }


}
