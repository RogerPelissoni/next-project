import { z } from "zod";

export const profileSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  ds_description: z.string().optional(),
  company_id: z.string().min(1, "Empresa obrigatória"),
});

export type ProfileFormSchema = z.infer<typeof profileSchema>;
