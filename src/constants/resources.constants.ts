export const RESOURCES = {
  USER: {
    key: "user",
    title: "Usuários",
    singular: "Usuário",
  },
  COMPANY: {
    key: "company",
    title: "Empresas",
    singular: "Empresa",
  },
  PERSON: {
    key: "person",
    title: "Pessoas",
    singular: "Pessoa",
  },
  PERSON_PHONE: {
    key: "personPhone",
    title: "Telefones",
    singular: "Telefone",
  },
  PROFILE: {
    key: "profile",
    title: "Perfis",
    singular: "Perfil",
  },
} as const;

export type ResourceKey = (typeof RESOURCES)[keyof typeof RESOURCES]["key"];
export type ResourceConfig = (typeof RESOURCES)[keyof typeof RESOURCES];
