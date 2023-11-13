import { Wheat } from '../element/wheat.ts';
import { ConstructorFunction } from '../di/dumpling.container.ts';

type MethodMetadataKeyType = {
  constructor: ConstructorFunction;
  methodName: string;
};

const classMetadataMap = new Map<ConstructorFunction, Map<symbol, any>>();

const methodMetadataMap = new Map<MethodMetadataKeyType, Map<symbol, any>>();

@Wheat()
export class MetadataContainer {
  private containerClassMetadataMap = new Map<ConstructorFunction, Map<symbol, any>>();

  private containerMethodMetadataMap = new Map<MethodMetadataKeyType, Map<symbol, any>>();

  constructor() {
    this.loadMetadata();
  }

  private loadMetadata() {
    classMetadataMap.forEach((metadataMap, target) => {
      const containerMetadataMap = new Map<symbol, any>();
      metadataMap.forEach((metadataValue, metadataKey) => {
        containerMetadataMap.set(metadataKey, metadataValue);
      });
      this.containerClassMetadataMap.set(target, containerMetadataMap);
    });

    methodMetadataMap.forEach((metadataMap, methodMetadataKey) => {
      const containerMetadataMap = new Map<symbol, any>();
      metadataMap.forEach((metadataValue, metadataKey) => {
        containerMetadataMap.set(metadataKey, metadataValue);
      });
      this.containerMethodMetadataMap.set(methodMetadataKey, containerMetadataMap);
    });
  }

  public static setClassMetadata<T>(target: ConstructorFunction, metadataKey: symbol, metadataValue: T) {
    let metadataMap = classMetadataMap.get(target);

    if (!metadataMap) {
      metadataMap = new Map<symbol, any>();
      classMetadataMap.set(target, metadataMap);
    }

    metadataMap.set(metadataKey, metadataValue);
  }

  public getClassMetadata<T>(target: ConstructorFunction, metadataKey: symbol): T | null {
    const metadataMap = this.containerClassMetadataMap.get(target);

    if (!metadataMap) {
      return null;
    }

    return metadataMap.get(metadataKey);
  }

  public static setMethodMetadata<T>(
    target: ConstructorFunction,
    methodName: string,
    metadataKey: symbol,
    metadataValue: T,
  ) {
    const methodMetadataKey: MethodMetadataKeyType = { constructor: target, methodName };

    let metadataMap = methodMetadataMap.get(methodMetadataKey);

    if (!metadataMap) {
      metadataMap = new Map<symbol, any>();
      methodMetadataMap.set(methodMetadataKey, metadataMap);
    }

    metadataMap.set(metadataKey, metadataValue);
  }

  public getMethodMetadata<T>(target: ConstructorFunction, methodName: string, metadataKey: symbol): T | null {
    const methodMetadataKey: MethodMetadataKeyType = { constructor: target, methodName };

    const metadataMap = this.containerMethodMetadataMap.get(methodMetadataKey);

    if (!metadataMap) {
      return null;
    }

    return metadataMap.get(metadataKey);
  }
}
