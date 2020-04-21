import { Status, IPackage, MClass } from '../../common/Joiner';
export class MPackage extends IPackage {
    constructor(model, json, metaparent) {
        super(model, json, metaparent);
        // todo: nel parse il json viene ignorato, cerca come vengono costruite le classi.
        // return;
        // this.setName(name);
        // this.setJson(json);
        this.parse(json, true);
    }
    getClass(name, caseSensitive = false, throwErr = true, debug = true) {
        return super.getClass(name, caseSensitive, throwErr, debug);
    }
    addEmptyClass(metaVersion) {
        const c = new MClass(this, null, metaVersion);
        if (Status.status.loadedLogic)
            c.generateVertex();
        console.log('addEmptyClass(); package:', this, '; metaVersion: ', metaVersion, 'classe:', c);
        return c;
    }
    generateModel() { return this.parent.generateModel(); }
    /*
    generateModel(rootClass: MClass): Json {
      const key: string = U.toDottedURI(this.uri) + ':' + rootClass.name;
      const xmlnsuri = '@xmlns:org.eclipse.example.' + this.name;
      const value: Json = {
        '@xmlns:xmi': 'http://www.omg.org/XMI',
        xmlnsuri : U.toHttpsURI(this.uri), // "-xmlns:org.eclipse.example.bowling": "https://org/eclipse/example/bowling",
        '-xmi:version': '2.0',
      };
      let i: number;
      for (i = 0, i < this.childrens.length; i++) {
        const cl: MClass = this.childrens[i];
        value[cl.name] = wrongggg!!! non è nemmeno un package, è una cosa del tipo:
      }
      return undefined;
    }
  
    getInfo(toLower?: boolean): any {
    }
  
    LinkToMetaParent(meta: IPackage): void {
    }
  */
    parse(json, destructive = true, uri = null, name = null) {
        /* e se c'è un riferimento circolare?
          <league (rootclass)>
            <players (attribute)>
              <player>...</player>
            </players>
          </league>
    
        "org.eclipse.example.bowling:League": {
          "-xmlns:xmi": "http://www.omg.org/XMI",
          "-xmlns:org.eclipse.example.bowling": "https://org/eclipse/example/bowling",
          "-xmi:version": "2.0",
          "Players": [
              { "-name": "tizio" },
              { "-name": "asd" } ]
      }*/
        let i; /*
        this.views = [];
        for(i = 0; i < this.parent.viewpoints.length; i++) {
          const vp: ViewPoint = this.parent.viewpoints[i];
          const v = new PackageView(vp.modelView);
          this.views.push(v);
          vp.modelView.packageViews.push(v); }*/
    }
}
//# sourceMappingURL=MPackage.component.js.map