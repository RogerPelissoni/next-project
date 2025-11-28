export interface MenuItem {
  label: string;
  href?: string;
  children?: {
    label: string;
    href: string;
  }[];
}

export const menuConfig: MenuItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Cadastros",
    children: [
      { label: "Usuários", href: "/usuarios" },
      { label: "Perfis", href: "/perfis" },
    ],
  },
  {
    label: "Relatórios",
    children: [
      { label: "Usuários", href: "/relatorios/usuarios" },
      { label: "Perfis", href: "/relatorios/perfis" },
    ],
  },
];
