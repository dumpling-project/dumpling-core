export const PipeTypeEnum = {
  BODY: 'BODY',
  PARAM: 'PARAM',
  QUERY: 'QUERY',
  CUSTOM: 'CUSTOM',
} as const;
export type PipeType = (typeof PipeTypeEnum)[keyof typeof PipeTypeEnum];
