interface MenuItem {
  label: string;
  to?: string;
  items?: MenuItem[];
}

// telas do menu comum a todas as empresas
export const menuOptionsCommon: MenuItem[] = [
  {
    label: "Gestão",
    items: [
      {
        label: "Usuários",
        to: "/app/users",
      },
      {
        label: "Parceiros",
        to: "/app/partners",
      },
      {
        label: "Empresas",
        to: "/app/companies",
      },
      {
        label: "Prioridades",
        to: "/app/priorities",
      },
    ],
  },
];

export const menuOptionsAdmin: MenuItem[] = [
  ...menuOptionsCommon,
  {
    label: "Produtos",
    to: "/app/products",
  },
  // {
  //   label: "Pedidos",
  //   to: "/app/order",
  // },
];

// telas do menu específicas para cada empresa
export const menuOptionsTim: MenuItem[] = [
  ...menuOptionsCommon,
  // {
  //   label: "Dashboard",
  //   to: "/app",
  // },
  {
    label: "Produtos",
    items: [
      {
        label: "Banda Larga",
        to: "/app/products/telecom/banda-larga",
      },
      {
        label: "Telefonia Móvel",
        to: "/app/products/telecom/telefonia-movel",
      },
    ],
  },
  // {
  //   label: "Pedidos",
  //   items: [
  //     {
  //       label: "Banda Larga",
  //       to: "/app/order/telecom/banda-larga",
  //     },
  //     {
  //       label: "Telefonia Móvel",
  //       to: "/app/order/telecom/telefonia-movel",
  //     },
  //   ],
  // },
];

export const menuOptionsClaro: MenuItem[] = [...menuOptionsCommon];

export const menuOptionsVivo: MenuItem[] = [
  ...menuOptionsCommon,
  // {
  //   label: "Dashboard",
  //   to: "/app",
  // },
];

export const menuOptionsVR: MenuItem[] = [...menuOptionsCommon];

export const menuOptionsC6: MenuItem[] = [
  ...menuOptionsCommon,
  {
    label: "Produtos",
    items: [
      {
        label: "Maquininha",
        to: "/app/products/finances/maquininha",
      },
      {
        label: "Empréstimo",
        to: "/app/products/finances/emprestimo",
      },
    ],
  },
];

export const menuOptionsBrisanet: MenuItem[] = [...menuOptionsCommon];
export const menuOptionsAlgar: MenuItem[] = [...menuOptionsCommon];
