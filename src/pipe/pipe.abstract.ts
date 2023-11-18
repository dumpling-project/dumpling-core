export abstract class AbstractPipe {
  public transform(value: any): any {
    return value;
  }
  public execute(value: any): any {
    return this.transform(value);
  }
}
