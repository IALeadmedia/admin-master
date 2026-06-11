interface MenuItem {
  label: string;
  to?: string;
  items?: MenuItem[];
  href?: string;
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
  {
    label: "Chatter",
    items: [
      {
        label: "Chat",
        to: "/app/chat",
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
  {
    label: "Pedidos",
    to: "/app/order",
  },
];

// telas do menu específicas para cada empresa
export const menuOptionsTim: MenuItem[] = [
  ...menuOptionsCommon,
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
  {
    label: "Pedidos",
    items: [
      {
        label: "Banda Larga PF",
        to: "/app/order/telecom/banda-larga/pf",
      },
      {
        label: "Banda Larga PJ",
        to: "/app/order/telecom/banda-larga/pj",
      },
    ],
  },
  {
    label: "LPs",
    items: [
      {
        label: "Banda Larga PF",
        href: "https://timfibra.promo/",
      },
      {
        label: "Banda Larga PJ",
        href: "https://timfibra.promo/pj",
      },
    ],
  },
];

export const menuOptionsClaro: MenuItem[] = [
  ...menuOptionsCommon,
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
  {
    label: "Pedidos",
    items: [
      {
        label: "Banda Larga PF",
        to: "/app/order/telecom/banda-larga/pf",
      },
      {
        label: "Banda Larga PJ",
        to: "/app/order/telecom/banda-larga/pj",
      },
      // {
      //   label: "Telefonia Móvel",
      //   to: "/app/order/telecom/telefonia-movel",
      // },
    ],
  },
  {
    label: "LPs",
    items: [
      {
        label: "Banda Larga PJ",
        href: "https://clarofibra.promo/pj",
      },
    ],
  },
];

export const menuOptionsVivo: MenuItem[] = [
  ...menuOptionsCommon,
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
  {
    label: "Pedidos",
    items: [
      {
        label: "Banda Larga PF",
        to: "/app/order/telecom/banda-larga/pf",
      },
      {
        label: "Banda Larga PJ",
        to: "/app/order/telecom/banda-larga/pj",
      },
      // {
      //   label: "Telefonia Móvel",
      //   to: "/app/order/telecom/telefonia-movel",
      // },
    ],
  },
];

export const menuOptionsVR: MenuItem[] = [
  ...menuOptionsCommon,
  {
    label: "Pedidos",
    to: "/app/order/benefits",
  },
  {
    label: "LPs",
    items: [
      {
        label: "VR",
        href: "https://getempresas.com.br/vr/",
      },
      {
        label: "Vale Refeição",
        href: "https://getempresas.com.br/vr/vale-refeicao/index.html",
      },
      {
        label: "Vale Alimentação",
        href: "https://getempresas.com.br/vr/vale-alimentacao/index.html",
      },
      {
        label: "Vale Auto",
        href: "https://getempresas.com.br/vr/vale-auto/index.html",
      },
    ],
  },
];

export const menuOptionsC6: MenuItem[] = [
  ...menuOptionsCommon,
  {
    label: "Pedidos",
    to: "/app/order/finances",
  },
  {
    label: "LPs",
    items: [
      {
        label: "Conta PJ",
        href: "https://c6.business/conta-pj",
      },
      {
        label: "Capital de Giro",
        href: "https://c6.business/capital-giro-c6",
      },
      {
        label: "Cartão PJ ",
        href: "https://c6.business/cartao-pj-c6",
      },
      {
        label: "Maquininha",
        href: "https://c6.business/maquininha-c6-empresas",
      },
    ],
  },
];

export const menuOptionsBrisanet: MenuItem[] = [
  ...menuOptionsCommon,
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
  {
    label: "Pedidos",
    items: [
      {
        label: "Banda Larga PF",
        to: "/app/order/telecom/banda-larga/pf",
      },
      {
        label: "Banda Larga PJ",
        to: "/app/order/telecom/banda-larga/pj",
      },
      // {
      //   label: "Telefonia Móvel",
      //   to: "/app/order/telecom/telefonia-movel",
      // },
    ],
  },
  {
    label: "LPs",
    items: [
      {
        label: "Banda Larga PF",
        href: "https://brisanet.promo/",
      },
      {
        label: "Banda Larga PJ",
        href: "https://brisanet.promo/pj",
      },
    ],
  },
];
export const menuOptionsAlgar: MenuItem[] = [
  ...menuOptionsCommon,
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
  {
    label: "Pedidos",
    items: [
      {
        label: "Banda Larga PF",
        to: "/app/order/telecom/banda-larga/pf",
      },
      {
        label: "Banda Larga PJ",
        to: "/app/order/telecom/banda-larga/pj",
      },
      // {
      //   label: "Telefonia Móvel",
      //   to: "/app/order/telecom/telefonia-movel",
      // },
    ],
  },
  {
    label: "LPs",
    items: [
      {
        label: "Banda Larga PF",
        href: "https://algar.promo/",
      },
      {
        label: "Banda Larga PJ",
        href: "https://algar.promo/pj",
      },
    ],
  },
];
export const menuOptionsVero: MenuItem[] = [
  ...menuOptionsCommon,
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
  {
    label: "Pedidos",
    items: [
      {
        label: "Banda Larga PF",
        to: "/app/order/telecom/banda-larga/pf",
      },
      {
        label: "Banda Larga PJ",
        to: "/app/order/telecom/banda-larga/pj",
      },
      // {
      //   label: "Telefonia Móvel",
      //   to: "/app/order/telecom/telefonia-movel",
      // },
    ],
  },
];

export const menuOptionsNio: MenuItem[] = [
  ...menuOptionsCommon,
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
  {
    label: "Pedidos",
    items: [
      {
        label: "Banda Larga PF",
        to: "/app/order/telecom/banda-larga/pf",
      },
      {
        label: "Banda Larga PJ",
        to: "/app/order/telecom/banda-larga/pj",
      },
      // {
      //   label: "Telefonia Móvel",
      //   to: "/app/order/telecom/telefonia-movel",
      // },
    ],
  },
  {
    label: "LPs",
    items: [
      {
        label: "Banda Larga PF",
        href: "https://niofibra.promo/",
      },
    ],
  },
];
