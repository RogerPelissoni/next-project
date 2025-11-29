import { z } from "zod";

export const userSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.email("Email inválido"),
  password: z
    .string()
    .min(6, "Senha deve ter no mínimo 6 caracteres")
    .optional(),
  profile_id: z.string().min(1, "Perfil obrigatório"),
  company_id: z.string().min(1, "Empresa obrigatória"),
  person_id: z.string().min(1, "Pessoa obrigatória"),
});

export type UserFormSchema = z.infer<typeof userSchema>;
