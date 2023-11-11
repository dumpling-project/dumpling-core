import { QUERY_METADATA_KEY } from '../../../key/controller.metadata.key.ts';

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
    const requiredQueryParameters = Reflect.getOwnMetadata(QUERY_METADATA_KEY, target, propertyKey) || {};
    return Object.entries(requiredQueryParameters).map(([parameterIndex, queryParameterName]) => ({
      index: parseInt(parameterIndex, 10),
      value: queryVariables.get(queryParameterName as string),
    }));
  }
}
