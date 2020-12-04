export class User{
  // todo
  constructor(public key: string) {}

  getID(): string {
    return this.key;
  }
}
