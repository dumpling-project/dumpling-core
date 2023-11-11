export const HttpMethod = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH'
} as const
export type HttpMethodType = typeof HttpMethod[keyof typeof HttpMethod]