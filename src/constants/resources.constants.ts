export const RESOURCES = {
  USER: {
    key: "user",
    title: "Usuários",
    singular: "Usuário",
    description: "Gerenciamento de usuários do sistema",
  },
  COMPANY: {
    key: "company",
    title: "Empresas",
    singular: "Empresa",
    description: "Gerenciamento de empresas",
  },
  PROFILE: {
    key: "profile",
    title: "Perfis",
    singular: "Perfil",
    description: "Gerenciamento de perfis de acesso",
  },
} as const;

export type ResourceKey = (typeof RESOURCES)[keyof typeof RESOURCES]["key"];
export type ResourceConfig = (typeof RESOURCES)[keyof typeof RESOURCES];
