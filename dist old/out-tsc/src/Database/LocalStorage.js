import { TopBar, U, InputPopup } from '../common/Joiner';
export class SaveListEntry {
    constructor(lastopened, prefix, listname) {
        this.lastopened = lastopened;
        this.prefix = prefix;
        this.listname = listname;
    }
}
SaveListEntry.vertexPos = new SaveListEntry('_LastOpenedVertexPos', 'VertexPos', '_SaveListVertexPos');
SaveListEntry.view = new SaveListEntry('_LastOpenedView', 'ViewRule', '_SaveListView');
SaveListEntry.model = new SaveListEntry('_LastOpened', '', '_SaveList');
export class LocalStorage {
    constructor(model) {
        this.prefix = '' + '';
        this.print = true;
        this.popupTmp = null;
        this.model = null;
        this.model = model;
        this.prefix = model.getPrefixNum() + '_';
    }
    static getLastOpened(modelNumber) {
        const ret = { model: null, vertexpos: null, view: null };
        ret.model = localStorage.getItem(LocalStorage.reservedprefix + 'm' + modelNumber + '_' + SaveListEntry.model.lastopened);
        ret.view = localStorage.getItem(LocalStorage.reservedprefix + 'm' + modelNumber + '_' + SaveListEntry.view.lastopened);
        ret.vertexpos = localStorage.getItem(LocalStorage.reservedprefix + 'm' + modelNumber + '_' + SaveListEntry.vertexPos.lastopened);
        return ret;
    }
    static deleteLastOpened(modelNumber) { this.setLastOpened(modelNumber, null, null, null); }
    static setLastOpened(modelNumber, model = null, view = null, vertex = null) {
        const prefix = LocalStorage.reservedprefix + 'm' + modelNumber + '_';
        if (model)
            localStorage.setItem(prefix + SaveListEntry.model.lastopened, model);
        else
            localStorage.removeItem(prefix + SaveListEntry.model.lastopened);
        if (view)
            localStorage.setItem(prefix + SaveListEntry.view.lastopened, view);
        else
            localStorage.removeItem(prefix + SaveListEntry.view.lastopened);
        if (vertex)
            localStorage.setItem(prefix + SaveListEntry.vertexPos.lastopened, vertex);
        else
            localStorage.removeItem(prefix + SaveListEntry.vertexPos.lastopened);
    }
    getViewPoints() {
        const m = this.model;
        const ret = { view: null, vertexPos: null };
        if (!m.name)
            return ret;
        ret.view = this.get(m.name, SaveListEntry.view);
        ret.vertexPos = this.get(m.name, SaveListEntry.vertexPos);
        return ret;
    }
    addToList(key, listname) {
        const saveKeyList = this.getKeyList(listname, null);
        if (U.arrayContains(saveKeyList, key))
            return;
        saveKeyList.push(key);
        this.overwriteList(listname, saveKeyList);
    }
    removeFromList(key, listname) {
        const saveKeyList = this.getKeyList(listname, null);
        if (!U.arrayContains(saveKeyList, key))
            return;
        U.arrayRemoveAll(saveKeyList, key);
        this.overwriteList(listname, saveKeyList);
    }
    overwriteList(listname, value) {
        U.pe(!Array.isArray(value), 'recent savelist must be an array.');
        localStorage.setItem(LocalStorage.reservedprefix + this.prefix + listname, JSON.stringify(value));
        TopBar.topbar.updateRecents();
    }
    getKeyList(listname, limit = null) {
        const ret = JSON.parse(localStorage.getItem(LocalStorage.reservedprefix + this.prefix + listname));
        if (!ret) {
            return [];
        }
        U.pe(!Array.isArray(ret), 'savelist got is not an array:', ret);
        return isNaN(limit) ? ret : ret.splice(limit);
    }
    add(key = null, val, saveList) {
        U.pe(val !== '' + val, 'parameter should be string:', val);
        if (val !== '' + val) {
            val = JSON.stringify(val);
        }
        key = key ? this.prefix + saveList.prefix + key : null;
        if (val !== 'null' && val !== 'undefined')
            localStorage.setItem(LocalStorage.reservedprefix + this.prefix + saveList.lastopened, val);
        else
            localStorage.removeItem(LocalStorage.reservedprefix + this.prefix + saveList.lastopened);
        if (!key) {
            return;
        }
        this.addToList(key, saveList.listname);
        localStorage.setItem(key, val);
    }
    remove(oldKey, saveList) {
        if (!oldKey)
            return;
        oldKey = this.prefix + saveList.prefix + oldKey;
        this.removeFromList(oldKey, saveList.listname);
        localStorage.removeItem(oldKey);
    }
    get(key, saveList) {
        key = this.prefix + saveList.prefix + key;
        return localStorage.getItem(key);
    }
    rename(oldKey, newKey, saveList) {
        const oldVal = this.get(oldKey, saveList);
        this.remove(oldKey, saveList);
        this.add(newKey, oldVal, saveList);
    }
    p(arg1, ...restArgs) { U.pif(this.print, arg1, ...restArgs); }
    finishSave(saveVal) {
        const m = this.model;
        if (this.popupTmp) {
            this.popupTmp = this.popupTmp.destroy();
        }
        U.pe(!m.name, 'model name should be filled with a validated user input.');
        // must be recalculated, model.name might have been changed by user input (saveas or un-named model being given a name)
        let viewpointSave = JSON.stringify(m.generateViewPointSaveArr());
        this.add(m.name, saveVal, SaveListEntry.model);
        this.add(m.name, viewpointSave, SaveListEntry.view);
        this.add(m.name, this.vertexSaveStr, SaveListEntry.vertexPos);
        this.p(m.name + ' VertexPositions saved:', saveVal);
        this.p(m.name + ' ViewPoints saved:', viewpointSave);
        this.p(m.name + ' Model saved:', this.vertexSaveStr);
    }
    save_BlurEvent(e, saveVal) {
        const input = e.currentTarget;
        if (!+input.getAttribute('valid'))
            return;
        this.finishSave(saveVal);
    }
    save_OnKeyDown(e, saveVal) {
        // this.save_OnChange(e, popup, model);
        if (e.key !== 'return') {
            return;
        }
        this.save_BlurEvent(e, saveVal);
    }
    save_OnChange(e, model) {
        this.p('onchange');
        const input = e.currentTarget;
        let error = false;
        try {
            model.setName(input.value);
        }
        catch (e) {
            error = true;
        }
        finally { }
        if (error || input.value !== model.name) {
            this.popupTmp.setPostText('invalid or already registered name, a fix');
            input.setAttribute('valid', '0');
            if (model.name) {
                input.value = model.name;
            }
            return;
        }
        input.setAttribute('valid', '1');
    }
    saveModel(isAutosave, saveAs = false) {
        U.pe(!!this.popupTmp, 'should not be allowed to have 2 popup for the same Storage. this would lead to a conflict mixing data.');
        this.isAutosavetmp = isAutosave;
        this.saveAstmp = saveAs;
        const model = this.model;
        const ecoreJSONStr = model.generateModelString();
        this.vertexSaveStr = JSON.stringify(model.generateVertexPositionSaveArr());
        const name = model.name;
        const viepointJSONStr = JSON.stringify(model.generateViewPointSaveArr());
        this.p('save ' + this.prefix + 'Model[' + name + '] = ', ecoreJSONStr, 'viewpoints:', viepointJSONStr);
        this.add(null, ecoreJSONStr, SaveListEntry.model);
        this.add(null, viepointJSONStr, SaveListEntry.view);
        this.add(null, this.vertexSaveStr, SaveListEntry.vertexPos);
        let popup;
        const onblur = (e) => { this.save_BlurEvent(e, ecoreJSONStr); };
        const onkeydown = (e) => { this.save_OnKeyDown(e, ecoreJSONStr); };
        const onchange = (e) => { this.save_OnChange(e, model); };
        this.p('isAutosave:', isAutosave, 'saveAs:', saveAs, 'model.name:', model.name);
        // save with a name.
        if (name && name !== '') {
            this.finishSave(ecoreJSONStr);
            return;
        }
        // autosave without a name.
        if (isAutosave) {
            return;
        }
        // saveas without a name.
        if (saveAs) {
            const onSuccess = (value, input) => { model.setName(value); };
            const validator = (value, input) => {
                const oldVal = model.name;
                const ret = model.setName(value) === value;
                if (oldVal)
                    model.setName(oldVal);
                return ret;
            };
            popup = new InputPopup('Choose a name for the ' + model.friendlyClassName(), '', '', null, model.friendlyClassName() + ' name', '', 'input', 'text', [onSuccess]);
            popup.setValidation(validator, U.getTSClassName(model) + ' name is already used or contains invalid pattern.');
            popup.getInputNode()[0].pattern = '^[a-zA-Z_$][a-zA-Z_$0-9]*$';
            popup.show(true);
            return;
        }
        // user clicked save without a name
    }
    pushToServer() { }
    autosave(turn, permanendNotImplemented = false) {
        localStorage.setItem('autosave', '' + turn);
    }
}
LocalStorage.reservedprefix = '_';
export class LocalStorageM {
}
export class LocalStorageM3 extends LocalStorageM {
}
export class LocalStorageM2 extends LocalStorageM {
}
export class LocalStorageM1 extends LocalStorageM {
}
export class LocalStorageStyles extends LocalStorage {
}
//# sourceMappingURL=LocalStorage.js.map