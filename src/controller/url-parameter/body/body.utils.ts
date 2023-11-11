import { BODY_METADATA_KEY } from '../../../key/controller.metadata.key.ts';

export type BodyResultType = {
  index: number;
  value: any;
};
export class BodyUtils {
  public static async applyBody(request: Request, target: Object, propertyKey: string | symbol, args: any[]) {
    const requiredBodyParams = Reflect.getOwnMetadata(BODY_METADATA_KEY, target, propertyKey) || {};
    const bodyData = await this.resolveBodyData(request); // 여기서 적절한 파싱 로직을 추가할 수 있습니다.
    return Object.entries(requiredBodyParams).map(([parameterIndex, _]) => ({
      index: parseInt(parameterIndex, 10),
      value: bodyData,
    }));
  }

  private static async resolveBodyData(request: Request) {
    const contentType = request.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return await request.json();
    } else if (contentType?.includes('application/text')) {
      return await request.text();
    } else if (contentType?.includes('text/html')) {
      return await request.text();
    } else if (contentType?.includes('multipart/form-data')) {
      return await request.formData();
    } else if (contentType?.includes('application/x-www-form-urlencoded')) {
      return await request.formData();
    }
  }
}
