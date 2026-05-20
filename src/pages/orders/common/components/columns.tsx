import { Button, Tooltip, type TableColumnsType } from "antd";
import {
    AlertCircle,
    CheckCircle2,
    MapIcon,
    MapPinned,
    Mars,
    Monitor,
    Smartphone,
    Tablet,
    Venus,
    XCircle,
} from "lucide-react";
import { formatCPF } from "@/utils/document.util";
import { formatPhoneNumber } from "@/utils/number.utils";
import {
    formatBrowserDisplay,
    formatOSDisplay,
    formatResolution,
} from "@/utils/orders.util";
import type {
    OrderBase,
    OrderCompanyPartner,
    OrderFingerprint,
    OrderGeolocation,
    OrderWhatsAppInfo,
} from "@/types/orders/base.type";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Thermometer } from "@/layout/common-components/Thermomter";

type OrderCommonRecord = OrderBase & {
    rfb_name?: string | null;
    rfb_birth_date?: string | null;
    rfb_mother_name?: string | null;
    rfb_gender?: string | null;
    phone_valid?: boolean | number | null;
    is_email_valid?: boolean | null;
    is_mei?: boolean | null;
    is_socio?: boolean | null;
    company_partners?: Array<OrderCompanyPartner> | string | null;
    portability?: string | null;
    whatsapp?: OrderWhatsAppInfo | null;
    geolocation?: OrderGeolocation | null;
    client_ip?: string | null;
    ip_isp?: string | null;
    ip_access_type?: string | null;
    fingerprint?: OrderFingerprint | null;
    fingerprint_id?: string | null;
    crm_id?: string | number | null;
    service?: string | null;
    installation?: string | null;
    pf_temperature?: number | null;
};

export type SharedOrderRecord = OrderCommonRecord & {
    debit?: boolean | number | string | null;
    credit?: boolean | number | string | null;
};

function normalizeNames(name1?: string | null, name2?: string | null) {
    if (!name1 || !name2) return null;

    const normalizeText = (text: string) =>
        text
            .toLowerCase()
            .trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

    return normalizeText(name1) === normalizeText(name2);
}

function normalizeCompanyPartners(companyPartners?: OrderCommonRecord["company_partners"]) {
    if (!companyPartners) return [] as Array<{ cnpj: string; nome: string; porte: string }>;

    if (Array.isArray(companyPartners)) {
        return companyPartners;
    }

    try {
        const parsed = JSON.parse(companyPartners);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}


export function getSharedOrderColumnsBefore<T extends OrderCommonRecord>(): TableColumnsType<T> {
    return [{
        title: "",
        dataIndex: "consultant_observation",
        width: 30,
        render: (consultant_observation) => (
            <Tooltip
                placement="top"
                title={consultant_observation || "Sem observações"}
                overlayInnerStyle={{ fontSize: 12 }}
            >
                {consultant_observation && <ExclamationCircleOutlined />}
            </Tooltip>
        ),
    },
    {
        title: "",
        dataIndex: ["whatsapp", "avatar"],
        width: 80,
        render: (avatar, record) => {
            const avatarSrc = avatar || "/assets/anonymous_avatar.png";

            if (record.pf_temperature === 10) {
                return (
                    <div className="flex bg-[#d63535] rounded-full w-9 h-9 items-center justify-center relative">


                        <img
                            src={avatarSrc}
                            className="rounded-full w-9 h-9 object-cover"
                        />
                        <div className="text-sm absolute -top-1 -right-1 flex items-center justify-center">
                            🔥
                        </div>

                    </div>
                );
            }
            return (

                <img
                    src={avatarSrc}

                />
            );
        },
    },
    {
        title: "Temperatura",
        dataIndex: "pf_temperature",
        width: 140,
        render: (pf_temperature) => (
            <div className="flex w-[120px] h-2 items-center gap-1 mr-4">
                {" "}
                <Thermometer min={0} max={10} value={pf_temperature || 0} />
            </div>
        ),
    },
    {
        title: "ID",
        dataIndex: "order_number",
        width: 110,
        render: (order_number, record) =>
            order_number ? order_number : record.id || "-",
    },

    {
        title: "Abertura",
        dataIndex: "created_at",
        width: 110,

    },
    {
        title: "Pedido",
        dataIndex: "status",
        render: (status: string) =>
            status === "ABERTO"
                ? "Aberto"
                : status === "FECHADO"
                    ? "Fechado"
                    : status === "CANCELADO"
                        ? "Cancelado"
                        : "-",
        width: 80,
    }, {
        title: "Tramitação",
        ellipsis: {
            showTitle: false,
        },
        dataIndex: "after_sales_status",
        width: 155,

        render: (after_sales_status) => (
            <Tooltip
                placement="topLeft"
                title={after_sales_status}
                overlayInnerStyle={{ fontSize: 12 }}
            >
                {after_sales_status || "-"}
            </Tooltip>
        ),
    }, {
        title: "Recadastro",
        dataIndex: "number_attempts_second_call",
        width: 110,
        render: (number_attempts_second_call) => number_attempts_second_call || "-",
    },
    {
        title: "CPF",
        dataIndex: "cpf",
        width: 120,
        render: (cpf) => (cpf ? formatCPF(cpf) : "-"),
        filters: [
            { text: "Preenchido", value: "preenchido" },
            { text: "Vazio", value: "vazio" },
        ],
        onFilter: (value, record) => {
            if (value === "preenchido") {
                return record.cpf !== null && record.cpf !== undefined && record.cpf !== "";
            }

            if (value === "vazio") {
                return record.cpf === null || record.cpf === undefined || record.cpf === "";
            }

            return true;
        },
    },
    {
        title: "Nome",
        dataIndex: "full_name",
        ellipsis: { showTitle: false },
        render: (full_name, record) => {
            const isNamesMatch = normalizeNames(full_name, record.rfb_name);

            return full_name ? (
                <span className="flex items-center gap-1">
                    {full_name}
                    {isNamesMatch === true ? (
                        <Tooltip title="Nome confere com RFB" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </Tooltip>
                    ) : isNamesMatch === false ? (
                        <Tooltip title="Nome diferente da RFB" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                            <XCircle className="h-4 w-4 text-red-500" />
                        </Tooltip>
                    ) : null}
                </span>
            ) : (
                "-"
            );
        },
        width: 240,
    },
    {
        title: "Gênero",
        dataIndex: "rfb_gender",
        width: 80,
        render: (rfb_gender) =>
            rfb_gender === "M" ? (
                <div className="flex items-center justify-center">
                    <Mars color="blue" size={17} />
                </div>
            ) : rfb_gender === "F" ? (
                <div className="flex items-center justify-center">
                    <Venus color="magenta" size={18} />
                </div>
            ) : (
                <div className="flex items-center justify-center">-</div>
            ),
    },
    {
        title: "Data de Nascimento",
        dataIndex: "birth_date",
        width: 150,
        render: (birth_date, record) => {
            const compareDates = (date1?: string | null, date2?: string | null) => {
                if (!date1 || !date2) return null;
                return date1.trim() === date2.trim();
            };

            const isDatesMatch =
                birth_date && birth_date !== "00/00/0000"
                    ? compareDates(birth_date, record.rfb_birth_date)
                    : null;

            return (
                <span className="flex items-center gap-1">
                    {birth_date && birth_date !== "00/00/0000" ? birth_date : "-"}
                    {isDatesMatch === true ? (
                        <Tooltip title="Data de nascimento confere com RFB" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </Tooltip>
                    ) : isDatesMatch === false ? (
                        <Tooltip title="Data de nascimento diferente da RFB" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                            <XCircle className="h-4 w-4 text-red-500" />
                        </Tooltip>
                    ) : null}
                </span>
            );
        },
    },
    {
        title: "Nome da Mãe",
        dataIndex: "mother_full_name",
        ellipsis: { showTitle: false },
        render: (mother_full_name, record) => {
            const isNamesMatch = normalizeNames(mother_full_name, record.rfb_mother_name);

            return mother_full_name ? (
                <span className="flex items-center gap-1">
                    {mother_full_name}
                    {isNamesMatch === true ? (
                        <Tooltip title="Nome da mãe confere com RFB" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </Tooltip>
                    ) : isNamesMatch === false ? (
                        <Tooltip title="Nome da mãe diferente da RFB" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                            <XCircle className="h-4 w-4 text-red-500" />
                        </Tooltip>
                    ) : null}
                </span>
            ) : (
                "-"
            );
        },
        width: 220,
    },
    {
        title: "MEI",
        dataIndex: "is_mei",
        width: 70,
        render: (is_mei) => (is_mei ? "Sim" : is_mei === undefined || is_mei === null ? "-" : "Não"),
    },
    {
        title: "Sócio",
        dataIndex: "is_socio",
        width: 70,
        render: (is_socio) =>
            is_socio ? "Sim" : is_socio === undefined || is_socio === null ? "-" : "Não",
    },
    {
        title: "Empresas",
        dataIndex: "company_partners",
        width: 210,
        ellipsis: { showTitle: false },
        render: (company_partners) => {
            const companies = normalizeCompanyPartners(company_partners);

            if (!companies.length) return "-";

            const empresasFormatadas = companies
                .map((empresa) => `${empresa.cnpj}, ${empresa.nome}, ${empresa.porte}`)
                .join("; \n");

            return (
                <Tooltip
                    placement="topLeft"
                    title={<div style={{ whiteSpace: "pre-line" }}>{empresasFormatadas}</div>}
                    overlayInnerStyle={{ fontSize: 12 }}
                >
                    {empresasFormatadas}
                </Tooltip>
            );
        },
    },
    {
        title: "Telefone",
        dataIndex: "phone",
        width: 180,
        render: (_, record) => {
            if (!record.phone) return "-";

            const isValid = Number(record.phone_valid);

            return (
                <span className="flex items-center gap-1">
                    {formatPhoneNumber(record.phone)}
                    {isValid === 1 ? (
                        <Tooltip title="Válido na ANATEL" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </Tooltip>
                    ) : isValid === 0 ? (
                        <Tooltip title="Inválido na ANATEL" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                            <XCircle className="h-4 w-4 text-red-500" />
                        </Tooltip>
                    ) : null}
                </span>
            );
        },
        filters: [
            { text: "Preenchido", value: "preenchido" },
            { text: "Vazio", value: "vazio" },
        ],
        onFilter: (value, record) => {
            if (value === "preenchido") {
                return record.phone !== null && record.phone !== undefined && record.phone !== "";
            }

            if (value === "vazio") {
                return record.phone === null || record.phone === undefined || record.phone === "";
            }

            return true;
        },
    },
    {
        title: "Portado",
        dataIndex: "portability",
        width: 90,
        render: (portability) => portability || "-",
    },
    {
        title: "Whatsapp",
        dataIndex: ["whatsapp", "is_comercial"],
        width: 90,
        render: (is_comercial, record) => {
            const whatsappData = record?.whatsapp;
            const hasInvalidPhoneError =
                (whatsappData as { erro?: string } | null)?.erro === "Telefone inválido";

            if (hasInvalidPhoneError || whatsappData?.sucesso === false) {
                return <div className="flex items-center justify-center">Não</div>;
            }

            if (whatsappData?.existe_no_whatsapp === false) {
                return <div className="flex items-center justify-center">Não</div>;
            }

            return (
                <div className="flex items-center justify-center">
                    {is_comercial === true ? (
                        <Tooltip title="Business" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                            <img src="/assets/whatsapp-business.png" alt="Business" className="h-6 w-6" />
                        </Tooltip>
                    ) : is_comercial === false ? (
                        <Tooltip title="Messenger" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                            <img src="/assets/whatsapp-messenger.png" alt="Messenger" className="h-6 w-6" />
                        </Tooltip>
                    ) : (
                        "-"
                    )}
                </div>
            );
        },
    },
    {
        title: "Email",
        dataIndex: "email",
        width: 240,
        ellipsis: { showTitle: false },
        render: (_, record) => (
            <span className="flex items-center gap-1">
                <Tooltip placement="topLeft" title={record.email || "-"} overlayInnerStyle={{ fontSize: 12 }}>
                    <span
                        style={{
                            maxWidth: 180,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            display: "inline-block",
                            verticalAlign: "middle",
                        }}
                    >
                        {record.email || "-"}
                    </span>
                </Tooltip>
                {record.is_email_valid === true ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : record.is_email_valid === false ? (
                    <XCircle className="h-4 w-4 text-red-500" />
                ) : null}
            </span>
        ),
    },] as TableColumnsType<T>;
}

export function getSharedOrderColumnsAfter<T extends OrderCommonRecord>(): TableColumnsType<T> {
    return [
    {
        title: "CEP",
        dataIndex: "zip_code",
        width: 130,
        render: (_, record) => {
            if (!record.zip_code) return "-";

            const isValidCep = record.address && record.district && record.city && record.state;
            const isCepUnico = record.single_zip_code;

            return (
                <span className="flex items-center gap-1">
                    {record.zip_code}
                    {isCepUnico ? (
                        <Tooltip
                            title="CEP único para localidade. Dados inseridos manualmente pelo usuário. Sujeito a erro de digitação."
                            placement="top"
                            overlayInnerStyle={{ fontSize: 12 }}
                        >
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                        </Tooltip>
                    ) : isValidCep ? (
                        <Tooltip title="CEP válido com endereço completo" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </Tooltip>
                    ) : (
                        <Tooltip title="CEP inválido ou incompleto" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                            <XCircle className="h-4 w-4 text-red-500" />
                        </Tooltip>
                    )}
                </span>
            );
        },
    },
    {
        title: "Endereço",
        dataIndex: "address",
        width: 160,
        ellipsis: { showTitle: false },
        render: (address) => (
            <Tooltip placement="topLeft" title={address} overlayInnerStyle={{ fontSize: 12 }}>
                {address || "-"}
            </Tooltip>
        ),
    },
    {
        title: "Número",
        dataIndex: "address_number",
        width: 80,
        render: (addressNumber) => addressNumber || "-",
    },
    {
        title: "Bairro",
        dataIndex: "district",
        width: 120,
        ellipsis: { showTitle: false },
        render: (district) => (
            <Tooltip placement="topLeft" title={district} overlayInnerStyle={{ fontSize: 12 }}>
                {district || "-"}
            </Tooltip>
        ),
    },
    {
        title: "Cidade",
        dataIndex: "city",
        width: 120,
        ellipsis: { showTitle: false },
        render: (city) => (
            <Tooltip placement="topLeft" title={city} overlayInnerStyle={{ fontSize: 12 }}>
                {city || "-"}
            </Tooltip>
        ),
    },
    {
        title: "UF",
        dataIndex: "state",
        width: 60,
        render: (state) => state || "-",
    },
    {
        title: "Coordenadas",
        dataIndex: "geolocation",
        width: 180,
        render: (geolocation) => {
            if (!geolocation || !geolocation.latitude || !geolocation.longitude) {
                return "-";
            }

            const coordenadas = `Lat: ${geolocation.latitude}\nLong: ${geolocation.longitude}`;
            return (
                <Tooltip placement="topLeft" title={coordenadas} overlayInnerStyle={{ fontSize: 12 }}>
                    <div style={{ whiteSpace: "nowrap" }}>
                        <div>Lat: {geolocation.latitude}</div>
                        <div>Long: {geolocation.longitude}</div>
                    </div>
                </Tooltip>
            );
        },
    },
    {
        title: "Maps",
        dataIndex: ["geolocation", "maps_link"],
        width: 80,
        ellipsis: { showTitle: false },
        render: (maps_link) =>
            maps_link ? (
                <div className="flex items-center justify-center">
                    <Tooltip placement="topLeft" title={maps_link} overlayInnerStyle={{ fontSize: 12 }}>
                        <Button
                            style={{ width: 32, height: 32, padding: 0 }}
                            type="default"
                            size="small"
                            onClick={(event) => {
                                event.stopPropagation();
                                window.open(maps_link, "_blank");
                            }}
                            tabIndex={0}
                        >
                            <MapIcon size={17} />
                        </Button>
                    </Tooltip>
                </div>
            ) : (
                <div className="flex items-center justify-center"><span>-</span></div>
            ),
    },
    {
        title: "Street View",
        dataIndex: ["geolocation", "street_view_link"],
        width: 110,
        ellipsis: { showTitle: false },
        render: (street_view_link) =>
            street_view_link ? (
                <div className="flex items-center justify-center">
                    <Tooltip placement="topLeft" title={street_view_link} overlayInnerStyle={{ fontSize: 12 }}>
                        <Button
                            style={{ width: 32, height: 32, padding: 0 }}
                            type="default"
                            size="small"
                            onClick={(event) => {
                                event.stopPropagation();
                                window.open(street_view_link, "_blank");
                            }}
                            tabIndex={0}
                        >
                            <MapPinned size={17} />
                        </Button>
                    </Tooltip>
                </div>
            ) : (
                <div className="flex items-center justify-center"><span>-</span></div>
            ),
    },
    {
        title: "URL",
        dataIndex: "url",
        width: 140,
        ellipsis: { showTitle: false },
        render: (url) => (
            <Tooltip placement="topLeft" title={url} overlayInnerStyle={{ fontSize: 12 }}>
                {url || "-"}
            </Tooltip>
        ),
    },
    {
        title: "IP do Cliente",
        dataIndex: "client_ip",
        width: 120,
        render: (client_ip) => client_ip || "-",
    },
    {
        title: "Provedor",
        dataIndex: "ip_isp",
        width: 120,
        ellipsis: { showTitle: false },
        render: (ip_isp) => (
            <Tooltip placement="topLeft" title={ip_isp} overlayInnerStyle={{ fontSize: 12 }}>
                {ip_isp || "-"}
            </Tooltip>
        ),
    },
    {
        title: "Tipo de acesso",
        dataIndex: "ip_access_type",
        width: 120,
        render: (ip_access_type) =>
            ip_access_type === "movel"
                ? "Móvel"
                : ip_access_type === "fixo"
                    ? "Fixo"
                    : ip_access_type === "hosting"
                        ? "Hosting"
                        : ip_access_type === "proxy"
                            ? "Proxy"
                            : ip_access_type === "local"
                                ? "Local"
                                : ip_access_type === "desconhecido"
                                    ? "Desconhecido"
                                    : "-",
    },
    {
        title: "Dispositivo",
        dataIndex: ["fingerprint", "device"],
        width: 100,
        render: (device) => (
            <div className="flex items-center justify-center">
                {device === "mobile" ? (
                    <Tooltip title="Mobile" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                        <Smartphone className="h-4 w-4 text-gray-600" />
                    </Tooltip>
                ) : device === "desktop" ? (
                    <Tooltip title="Desktop" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                        <Monitor className="h-4 w-4 text-gray-600" />
                    </Tooltip>
                ) : device === "tablet" ? (
                    <Tooltip title="Tablet" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                        <Tablet className="h-4 w-4 text-gray-600" />
                    </Tooltip>
                ) : (
                    "-"
                )}
            </div>
        ),
    },
    {
        title: "Plataforma",
        dataIndex: ["fingerprint", "os"],
        width: 140,
        render: (os) => formatOSDisplay(os),
    },
    {
        title: "Browser",
        dataIndex: ["fingerprint", "browser"],
        width: 120,
        render: (browser) => formatBrowserDisplay(browser),
    },
    {
        title: "TimeZone",
        dataIndex: ["fingerprint", "timezone"],
        width: 210,
        ellipsis: { showTitle: false },
        render: (timezone, record) => {
            const timezoneName = record?.fingerprint?.timezone_name;
            const value = [timezone, timezoneName].filter(Boolean).join(" - ");

            return (
                <Tooltip placement="topLeft" title={value || "-"} overlayInnerStyle={{ fontSize: 12 }}>
                    {value || "-"}
                </Tooltip>
            );
        },
    },
    {
        title: "Resolução",
        dataIndex: ["fingerprint", "resolution"],
        width: 120,
        render: (resolution) => formatResolution(resolution),
    },
    {
        title: "ID Fingerprint",
        dataIndex: "fingerprint_id",
        width: 120,
        render: (fingerprintId) => fingerprintId || "-",
    },
    {
        title: "Consultor",
        dataIndex: "responsible_consultant",
        width: 120,
        render: (responsible_consultant) => responsible_consultant || "-",
    },
    {
        title: "ID CRM",
        dataIndex: "crm_id",
        width: 120,
        render: (crm_id) => crm_id ? String(crm_id) : "-",
    },
    {
        title: "Atendimento",
        dataIndex: "service",
        width: 110,
        render: (service) => service || "-",
    },

    ] as TableColumnsType<T>;
}

export function getSharedOrderColumns<T extends OrderCommonRecord>(): TableColumnsType<T> {
    return [...getSharedOrderColumnsBefore<T>(), ...getSharedOrderColumnsAfter<T>()];
}
