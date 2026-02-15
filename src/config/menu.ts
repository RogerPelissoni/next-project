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
    href: "/dashboard",
  },
  {
    label: "Cadastros",
    children: [
      { label: "Empresas", href: "/dashboard/company" },
      { label: "Pessoas", href: "/dashboard/person" },
      { label: "Perfis", href: "/dashboard/profile" },
      { label: "Usuários", href: "/dashboard/user" },
    ],
  },
  {
    label: "Relatórios",
    children: [
      { label: "Usuários", href: "/dashboard/report/user" },
      { label: "Perfis", href: "/dashboard/report/profile" },
    ],
  },
];
