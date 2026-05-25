import timLogo from "@/assets/logos/tim-logo.png";
import claroLogo from "@/assets/logos/claro-logo.svg";
import vivoLogo from "@/assets/logos/vivo-logo.png";
import vrLogo from "@/assets/logos/vr-logo.png";
import c6Logo from "@/assets/logos/c6-logo.png";
import brisanetLogo from "@/assets/logos/brisanet-logo.png";
import algarLogo from "@/assets/logos/algar-logo.png";
import veroLogo from "@/assets/logos/vero-logo.svg";
import nioLogo from "@/assets/logos/nio-logo.svg";
import {
  menuOptionsClaro,
  menuOptionsTim,
  menuOptionsVivo,
  menuOptionsVR,
  menuOptionsC6,
  menuOptionsBrisanet,
  menuOptionsAlgar,
  menuOptionsVero,
  menuOptionsNio,
  menuOptionsAdmin,
} from "./menuItems.const";

/* 
brisanet.megalead.digital
tim.megalead.digital
vivo.megalead.digital
algar.megalead.digital
claro.megalead.digital
nio.megalead.digital
vero.megalead.digital
c6.megalead.digital
vr.megalead.digital
admin.megalead.digital → domínio geral do ADMIN
esses domínios, colocar no lugar dos numeros de portas dos options 
*/
const [subdomain] = window.location.hostname.split("."); // - PRODUÇÃO // usar esse
// const subdomain = window.location.port; // - DEV // remover essse quando ja tiver os domínios configurados
const url = window.location.origin;

export const options = {
  admin: {
    name: "Admin",
    logo: "/megalead.png",
    primaryColor: "#333333",
    baseUrl: "https://evolution.bigdates.com.br:3720",
    favicon: `${url}/favicon/favicon.ico`,
    optionsMenu: menuOptionsAdmin,
    isAdminDomain: true,
  },
  tim: {
    name: "Tim",
    logo: timLogo,
    primaryColor: "#0026d9",
    baseUrl: "https://evolution.bigdates.com.br:3720",
    favicon: `${url}/favicon/tim.ico`,
    optionsMenu: menuOptionsTim,
    isAdminDomain: false,
  },
  claro: {
    name: "Claro",
    logo: claroLogo,
    primaryColor: "#da291c",
    baseUrl: "https://evolution.bigdates.com.br:3720",
    favicon: `${url}/favicon/claro.ico`,
    optionsMenu: menuOptionsClaro,
    isAdminDomain: false,
  },
  vivo: {
    name: "Vivo",
    logo: vivoLogo,
    primaryColor: "#660099",
    baseUrl: "https://evolution.bigdates.com.br:3720",
    favicon: `${url}/favicon/vivo.ico`,
    optionsMenu: menuOptionsVivo,
    isAdminDomain: false,
  },
  vr: {
    name: "VR",
    logo: vrLogo,
    primaryColor: "#008a1e",
    baseUrl: "https://evolution.bigdates.com.br:3720",
    favicon: `${url}/favicon/vr.ico`,
    optionsMenu: menuOptionsVR,
    isAdminDomain: false,
  },
  c6: {
    name: "C6",
    logo: c6Logo,
    primaryColor: "#656565",
    baseUrl: "https://evolution.bigdates.com.br:3720",
    favicon: `${url}/favicon/c6.ico`,
    optionsMenu: menuOptionsC6,
    isAdminDomain: false,
  },
  brisanet: {
    name: "Brisanet",
    logo: brisanetLogo,
    primaryColor: "#ff4800",
    baseUrl: "https://evolution.bigdates.com.br:3720",
    favicon: `${url}/favicon/brisanet.ico`,
    optionsMenu: menuOptionsBrisanet,
    isAdminDomain: false,
  },
  algar: {
    name: "Algar",
    logo: algarLogo,
    primaryColor: "#23917e",
    baseUrl: "https://evolution.bigdates.com.br:3720",
    favicon: `${url}/favicon/algar.ico`,
    optionsMenu: menuOptionsAlgar,
    isAdminDomain: false,
  },
  vero: {
    name: "Vero",
    logo: veroLogo,
    primaryColor: "#D63066",
    baseUrl: "https://evolution.bigdates.com.br:3720",
    favicon: `${url}/favicon/vero.ico`,
    optionsMenu: menuOptionsVero,
    isAdminDomain: false,
  },
  nio: {
    name: "Nio",
    logo: nioLogo,
    primaryColor: "#14412A",
    baseUrl: "https://evolution.bigdates.com.br:3720",
    favicon: `${url}/favicon/nio.ico`,
    optionsMenu: menuOptionsNio,
    isAdminDomain: false,
  },
};

export const appSetting =
  options[subdomain as keyof typeof options] || options["admin"];

export const isAdminDomain = appSetting.isAdminDomain;
