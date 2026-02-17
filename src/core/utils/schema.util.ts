import { z } from "zod";

export function defineQuerySchema<
  TZod extends z.ZodObject<any>,
  TAppends extends Record<string, any> = {},
  THydrators extends Record<string, any> = {},
>(params: { schema: TZod; fields: readonly (keyof z.infer<TZod>)[]; appends?: TAppends; hydrators?: THydrators }) {
  return params;
}
