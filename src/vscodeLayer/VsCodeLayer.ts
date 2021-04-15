import {GenericObject, prxml2json, U} from '../common/Joiner';
import {onModelsReceive} from '../app/app.module';

export class VsCodeLayerOut{
  public static thisOrigin: string = location.origin;
  public static ancestorOrigin: string = location.ancestorOrigins && location.ancestorOrigins[0];
  public static send(message: GenericObject): void {
    console.log("sending data to:", VsCodeLayerOut.ancestorOrigin)
    window.parent.postMessage(message, VsCodeLayerOut.ancestorOrigin, undefined);
  }
}

export class VsCodeLayerIn{

  public static setupReceive(): void {
    // todo: dovrei spedire un evento al parent per notificarlo che jodel è pronto a ricevere
    console.log("1x adding event listener");
    window.addEventListener('message', VsCodeLayerIn.receive);
  }

  private static async receive(e /*window event*/): Promise<void> {
    console.log("1x jodel got message");
    const msg = e && e.data;
    const type = msg && msg.type;
    let body = msg && msg.body;
    switch (type){
      default:
        console.log("1x jodel received got message:", JSON.stringify(msg));
        break;
      case "webpackWarnings":
        U.enableConsole();
        break;
      case "init":
        console.log("1x jodel received got message init!!:", JSON.stringify(body));
        let xmistring = body;
        const xmlDoc = new DOMParser().parseFromString(xmistring,"text/xml");
        console.log('xml:', xmlDoc);
        let  jsonstr = prxml2json.xml2json(xmlDoc, '    ');
        console.log('1x jsonstr input: ', jsonstr);
        body = jsonstr;

        // U.pe(true, 'xml -> json', prxml2json, 'json -> xml', prjson2xml);
        const m2Bundle: {model: string, vertexpos: string, view: string} = {} as any;
        m2Bundle.model = body;
        const m1Bundle: {model: string, vertexpos: string, view: string} = {} as any;
        onModelsReceive(m2Bundle, m1Bundle);
        break;
      // case "webpackWarnings": break;
    }
  };
}
