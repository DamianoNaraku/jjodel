import { U } from './Joiner';
export var DatabaseMode;
(function (DatabaseMode) {
    DatabaseMode[DatabaseMode["browserMemory"] = 0] = "browserMemory";
    DatabaseMode[DatabaseMode["Sql"] = 1] = "Sql";
    DatabaseMode[DatabaseMode["File"] = 2] = "File";
})(DatabaseMode || (DatabaseMode = {}));
export class Database {
    constructor(mode = DatabaseMode.browserMemory, username = '_TestUser_', phpDbPageUrl = null, sqlurl = null, sqldb = null, sqlpass = null) {
        this.phpDbPageUrl = null;
        this.sqlurl = null;
        this.sqldb = null;
        this.sqluser = null;
        this.sqlpass = null;
        this.mode = null;
        this.mode = mode;
        this.sqluser = username;
        this.phpDbPageUrl = phpDbPageUrl;
        this.sqldb = sqldb;
        this.sqlpass = sqlpass;
        this.sqlurl = sqlurl;
    }
    writeKV(table, key, value) {
        switch (this.mode) {
            default:
                U.pe(true, 'unexpected db mode:', this.mode);
                break;
            case DatabaseMode.browserMemory:
                key = this.sqluser + '_' + table + '_' + key;
                localStorage.setItem(key, value);
                break;
            case DatabaseMode.Sql:
                U.pw(true, 'update sql: todo');
                break;
            case DatabaseMode.File:
                key = this.sqluser + '_' + table + '_' + key;
                U.pw(true, 'download file: todo');
                break;
        }
    }
    readKV(table, key) {
        switch (this.mode) {
            default:
                U.pe(true, 'unexpected db mode:', this.mode);
                break;
            case DatabaseMode.browserMemory:
                key = this.sqluser + '_' + table + '_' + key;
                return localStorage.getItem(key);
            case DatabaseMode.Sql:
                U.pw(true, 'select sql: todo');
                break;
            case DatabaseMode.File:
                U.pe(true, 'readKV: cannot be executed with savemode = File');
                break;
        }
    }
}
Database.db = new Database();
//# sourceMappingURL=Database.js.map