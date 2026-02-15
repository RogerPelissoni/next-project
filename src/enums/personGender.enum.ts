export const PersonGenderEnum = {
  F: "Feminino",
  M: "Masculino",
} as const;

export type PersonGenderEnumType = (typeof PersonGenderEnum)[keyof typeof PersonGenderEnum];
