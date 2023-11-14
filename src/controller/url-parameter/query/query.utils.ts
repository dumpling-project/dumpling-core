import { QUERY_METADATA_KEY } from '../../../metadata/key/controller.metadata.key.ts';
import { MetadataContainer } from '../../../metadata/metadata.container.ts';
import { ConstructorFunction } from '../../../di/dumpling.container.ts';

export type QueryResultType = {
  index: number;
  value: any;
};
export class QueryUtils {
  public static async applyQuery(
    url: URL,
    target: Object,
    propertyKey: string | symbol,
    args: any[],
  ): Promise<Array<QueryResultType>> {
    const queryVariables = new URLSearchParams(url.search);
    const requiredQueryParameters =
      MetadataContainer.getMethodMetadata(target.constructor as ConstructorFunction, propertyKey, QUERY_METADATA_KEY) ||
      {};
    return Object.entries(requiredQueryParameters).map(([parameterIndex, queryParameterName]) => ({
      index: parseInt(parameterIndex, 10),
      value: queryVariables.get(queryParameterName as string),
    }));
  }
}
