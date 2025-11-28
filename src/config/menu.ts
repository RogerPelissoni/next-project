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
      { label: "Usuários", href: "/user" },
      { label: "Perfis", href: "/profile" },
    ],
  },
  {
    label: "Relatórios",
    children: [
      { label: "Usuários", href: "/report/user" },
      { label: "Perfis", href: "/report/profile" },
    ],
  },
];
