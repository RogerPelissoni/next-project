import { z } from "zod";

export const companySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  tp_company: z.string().optional(),
  ds_email: z.string().optional(),
  ds_phone: z.string().optional(),
  ds_address: z.string().optional(),
});

export type CompanyFormSchema = z.infer<typeof companySchema>;
