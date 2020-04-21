import { Json, U, M2Class, ECorePackage, ECoreClass, Status, IPackage, EEnum, Type } from '../../common/Joiner';
export class M2Package extends IPackage {
    constructor(mm, json) {
        super(mm, json, Status.status.mmm.getPackage());
        this.parse(json, true);
    }
    getClass(name, caseSensitive = false, throwErr = true, debug = true) {
        return super.getClass(name, caseSensitive, throwErr, debug);
    }
    addEmptyClass() {
        const c = new M2Class(this, null);
        if (Status.status.loadedLogic) {
            c.generateVertex();
        }
        console.log('addEmptyClass(); package:', this, 'classe:', c);
        Type.updateTypeSelectors(null, false, false, true);
        return c;
    }
    parse(json, destructive = true) {
        // if (!json) { return; }
        /*
        json[ECorePackage.xmiversion] // '2.0';
        json[ECorePackage.xmlnsxmi] // 'http://www.omg.org/XMI';
        json[ECorePackage.xmlnsxsi] // 'http://www.w3.org/2001/XMLSchema-instance';
        json[ECorePackage.xmlnsecore] // 'http://www.eclipse.org/emf/2002/Ecore';
        json[ECorePackage.name];
        json[ECorePackage.eClassifiers]; */
        /// own attributes.
        const name = Json.read(json, ECorePackage.namee, 'defaultPackage');
        if (name)
            this.setName(name);
        const uri = Json.read(json, ECorePackage.nsURI, null);
        const nsPrefix = Json.read(json, ECorePackage.nsPrefix, null);
        this.parent.uri(uri);
        this.parent.namespace(nsPrefix);
        /// childrens
        const childs = Json.getChildrens(json);
        if (destructive) {
            this.childrens = [];
        }
        let i;
        for (i = 0; i < childs.length; i++) {
            const child = childs[i];
            if (!child) {
                U.pw(true, 'invalid m2Package in ecore input. found a null classifier, it will be ignored.');
                continue;
            }
            // metaParent = U.findMetaParentC(this, child);
            switch (child[ECoreClass.xsitype]) {
                default:
                    U.pe(true, 'unexpected xsitype:', child[ECoreClass.xsitype], ' found in jsonfragment:', child, ', in json:', json, ' package:', this);
                    break;
                case 'ecore:EClass':
                    new M2Class(this, child);
                    break;
                case 'ecore:EEnum':
                    new EEnum(this, child);
                    break;
            }
        }
    }
    /*parse(deep) {
      let i;
      if (deep) {
        if (this.childrens) { while (this.childrens.length !== 0) { this.childrens[0].delete(); } }
        this.childrens = [];
      }
      let field1;
      for (field1 in this.json) {
        if (!this.json.hasOwnProperty(field1)) { continue; } // il compilatore mi rompe per metterlo, non toglierlo se non da problemi.
        let val1 = Json.read<any>(this.json, field1);
        switch (field1) {
          default:
            U.pe(true, 'unexpected tag at jsonInput package: ' , field1 , ' = ', val1);
            break;
          case 'logical':
          case ECorePackage.xmlnsxsi:
          case ECorePackage.xmlnsxmi:
          case ECorePackage.xmlnsecore:
          case ECorePackage.nsPrefix:
          case ECorePackage.nsURI:
          case ECorePackage.xmiversion: break;
          case ECorePackage.name: break;
          case ECorePackage.eClassifiers:
            val1 = Json.getChildrens(this.json);
            for (i = 0; i < val1.length; i++) {
              if (deep) {
                U.pe ( !val1[i], 'val1[' + i + '] = ', val1[i], 'field:', field1, 'json:', this.json);
                const classe = new M2Class(this, val1[i]);
                this.childrens.push(classe as ModelPiece);
              }
            }
            break;
        }
      }
    }
  
    generateVertex(location: GraphPoint): IVertex {
      const v: IVertex = new IVertex();
      v.constructorPkg(this);
      v.draw();
      v.moveTo(location);
      return v; }
      */
    generateModel() {
        const classarr = [];
        const enumarr = [];
        let i;
        for (i = 0; i < this.classes.length; i++) {
            classarr.push(this.classes[i].generateModel());
        }
        for (i = 0; i < this.enums.length; i++) {
            enumarr.push(this.enums[i].generateModel());
        }
        const classifiers = Array.prototype.concat.call(classarr, enumarr);
        const model = new Json(null);
        model[ECorePackage.xmiversion] = '2.0';
        model[ECorePackage.xmlnsxmi] = 'http://www.omg.org/XMI';
        model[ECorePackage.xmlnsxsi] = 'http://www.w3.org/2001/XMLSchema-instance';
        model[ECorePackage.xmlnsecore] = 'http://www.eclipse.org/emf/2002/Ecore';
        model[ECorePackage.namee] = this.name;
        model[ECorePackage.nsURI] = this.parent.uri();
        model[ECorePackage.nsPrefix] = this.getModelRoot().namespace();
        model[ECorePackage.eClassifiers] = classifiers;
        /*
       "_xmi:version": "2.0",
       "_xmlns:xmi": "http://www.omg.org/XMI",
       "_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
       "_xmlns:ecore": "http://www.eclipse.org/emf/2002/Ecore",
       "_name": "bowling",
       "_nsURI": "http://org/eclipse/example/bowling",
       "_nsPrefix": "org.eclipse.example.bowling"*/
        return model;
    }
}
//# sourceMappingURL=MMPackage.js.map