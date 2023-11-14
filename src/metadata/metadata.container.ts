import { Wheat } from '../element/wheat.ts';
import { ConstructorFunction } from '../di/dumpling.container.ts';

type MethodMetadataKeyType = {
  constructorHash: string;
  methodName: string;
};

export class MetadataContainer {
  static classMetadataMap = new Map<string, Map<symbol, any>>();

  static methodMetadataMap = new Map<string, Map<symbol, any>>();

  public static setClassMetadata<T>(target: ConstructorFunction, metadataKey: symbol, metadataValue: T) {
    const hasher = new Bun.CryptoHasher('sha256');
    const classMetadataKey = hasher.update(target.toString()).digest('hex');

    let metadataMap = MetadataContainer.classMetadataMap.get(classMetadataKey);

    if (!metadataMap) {
      metadataMap = new Map<symbol, any>();
      MetadataContainer.classMetadataMap.set(classMetadataKey, metadataMap);
    }

    metadataMap.set(metadataKey, metadataValue);
  }

  public static getClassMetadata<T>(target: ConstructorFunction, metadataKey: symbol): T | null {
    const hasher = new Bun.CryptoHasher('sha256');
    const classMetadataKey = hasher.update(target.toString()).digest('hex');

    const metadataMap = MetadataContainer.classMetadataMap.get(classMetadataKey);

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
    const hasher = new Bun.CryptoHasher('sha256');
    const methodMetadataKey = hasher.update(target.toString()).update(methodName).digest('hex');

    let metadataMap = MetadataContainer.methodMetadataMap.get(methodMetadataKey);

    if (!metadataMap) {
      metadataMap = new Map<symbol, any>();
      MetadataContainer.methodMetadataMap.set(methodMetadataKey, metadataMap);
    }

    metadataMap.set(metadataKey, metadataValue);
  }

  public static getMethodMetadata<T>(target: ConstructorFunction, methodName: string, metadataKey: symbol): T | null {
    const hasher = new Bun.CryptoHasher('sha256');
    const methodMetadataKey = hasher.update(target.toString()).update(methodName).digest('hex');

    const metadataMap = MetadataContainer.methodMetadataMap.get(methodMetadataKey);

    if (!metadataMap) {
      return null;
    }

    return metadataMap.get(metadataKey);
  }
}
