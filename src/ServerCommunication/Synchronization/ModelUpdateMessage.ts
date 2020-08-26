export type UniqueIdentifier = string;

export class ModelUpdateMessage {
  targetObj: UniqueIdentifier;
  targetField: string;
  newValue: any;

  constructor(uid: UniqueIdentifier, fieldName: string, newValue: any){
    this.targetObj = uid;
    this.targetField = fieldName;
    this.newValue = newValue;
  }
}
