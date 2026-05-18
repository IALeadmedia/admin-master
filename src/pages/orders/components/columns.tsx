
import { Button, Tooltip, type TableColumnsType } from "antd";
import type { EntityType } from "../config-page.const";
import {
    AlertCircle,
    CheckCircle2,
    DollarSign,
    MapIcon,
    MapPinned,
    Mars,
    Monitor,
    Smartphone,
    Tablet,
    Venus,
    XCircle,
} from "lucide-react";
import { formatPhoneNumber } from "@/utils/number.utils";

import { ExclamationCircleOutlined } from "@ant-design/icons";
import { formatCPF } from "@/utils/document.util";
import { formatBrowserDisplay, formatOSDisplay } from "@/utils/orders.util";

type UseAllTableColumnsProps = {
    columns?: TableColumnsType<EntityType>;
};

export function useAllTableColumns({
    columns,
}: UseAllTableColumnsProps = {}): TableColumnsType<EntityType> {
    if (columns?.length) {
        return columns;
    }

    return [
        {
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
            title: "ID do Pedido",
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
        },
        {
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
        },
        {
            title: "Disponibilidade",
            dataIndex: ["operators_availability", "tim"],
            width: 120,
            render: (timAvailability) =>
                timAvailability?.available ? (
                    timAvailability?.found_via_range ? (
                        <div className="flex items-center justify-center ">
                            <Tooltip
                                title="Disponível (via range numérico)"
                                placement="top"
                                overlayInnerStyle={{ fontSize: 12 }}
                            >
                                <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                            </Tooltip>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center ">
                            <Tooltip
                                title="Disponível"
                                placement="top"
                                overlayInnerStyle={{ fontSize: 12 }}
                            >
                                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                            </Tooltip>
                        </div>
                    )
                ) : (
                    <div className="flex items-center justify-center ">
                        <Tooltip
                            title="Indisponível"
                            placement="top"
                            overlayInnerStyle={{ fontSize: 12 }}
                        >
                            <div className="h-2 w-2 bg-red-500 rounded-full"></div>{" "}
                        </Tooltip>
                    </div>
                ),
        },


        {
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
                {
                    text: "Preenchido",
                    value: "preenchido",
                },
                {
                    text: "Vazio",
                    value: "vazio",
                },
            ],

            onFilter: (value, record) => {
                if (value === "preenchido") {
                    return (
                        record.cpf !== null && record.cpf !== undefined && record.cpf !== ""
                    );
                }
                if (value === "vazio") {
                    return (
                        record.cpf === null || record.cpf === undefined || record.cpf === ""
                    );
                }
                return true;
            },
        },
        {
            title: "Nome",
            dataIndex: "full_name",
            ellipsis: {
                showTitle: false,
            },
            render: (full_name, record) => {
                const compareNames = (
                    name1?: string | null,
                    name2?: string | null,
                ) => {
                    if (!name1 || !name2) return null;

                    const normalizeText = (text: string) => {
                        return text
                            .toLowerCase()
                            .trim()
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "");
                    };

                    return normalizeText(name1) === normalizeText(name2);
                };

                const isNamesMatch = compareNames(full_name, record.rfb_name
                );

                return (
                    <>
                        {full_name ? (
                            <span className="flex items-center gap-1">
                                {full_name}
                                {isNamesMatch === true ? (
                                    <Tooltip
                                        title="Nome confere com RFB"
                                        placement="top"
                                        overlayInnerStyle={{ fontSize: 12 }}
                                    >
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    </Tooltip>
                                ) : isNamesMatch === false ? (
                                    <Tooltip
                                        title="Nome diferente da RFB"
                                        placement="top"
                                        overlayInnerStyle={{ fontSize: 12 }}
                                    >
                                        <XCircle className="h-4 w-4 text-red-500" />
                                    </Tooltip>
                                ) : null}
                            </span>
                        ) : (
                            "-"
                        )}
                    </>
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
                const compareDates = (
                    date1?: string | null,
                    date2?: string | null,
                ) => {
                    if (!date1 || !date2) return null;
                    return date1.trim() === date2.trim();
                };

                const isDatesMatch =
                    birth_date && birth_date !== "00/00/0000"
                        ? compareDates(birth_date, record.rfb_birth_date
                        )
                        : null;

                return (
                    <span className="flex items-center gap-1">
                        {birth_date && birth_date !== "00/00/0000" ? birth_date : "-"}
                        {isDatesMatch === true ? (
                            <Tooltip
                                title="Data de nascimento confere com RFB"
                                placement="top"
                                overlayInnerStyle={{ fontSize: 12 }}
                            >
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                            </Tooltip>
                        ) : isDatesMatch === false ? (
                            <Tooltip
                                title="Data de nascimento diferente da RFB"
                                placement="top"
                                overlayInnerStyle={{ fontSize: 12 }}
                            >
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
            ellipsis: {
                showTitle: false,
            },
            render: (mother_full_name, record) => {
                const compareNames = (
                    name1?: string | null,
                    name2?: string | null,
                ) => {
                    if (!name1 || !name2) return null;

                    const normalizeText = (text: string) => {
                        return text
                            .toLowerCase()
                            .trim()
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "");
                    };

                    return normalizeText(name1) === normalizeText(name2);
                };

                const isNamesMatch = compareNames(
                    mother_full_name,
                    record.rfb_mother_name,
                );

                return (
                    <>
                        {mother_full_name ? (
                            <span className="flex items-center gap-1">
                                {mother_full_name}
                                {isNamesMatch === true ? (
                                    <Tooltip
                                        title="Nome da mãe confere com RFB"
                                        placement="top"
                                        overlayInnerStyle={{ fontSize: 12 }}
                                    >
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    </Tooltip>
                                ) : isNamesMatch === false ? (
                                    <Tooltip
                                        title="Nome da mãe diferente da RFB"
                                        placement="top"
                                        overlayInnerStyle={{ fontSize: 12 }}
                                    >
                                        <XCircle className="h-4 w-4 text-red-500" />
                                    </Tooltip>
                                ) : null}
                            </span>
                        ) : (
                            "-"
                        )}
                    </>
                );
            },
            width: 220,
        },
        {
            title: "MEI",
            dataIndex: "is_mei",
            width: 70,
            render: (is_mei) =>
                is_mei ? "Sim" : is_mei === undefined || is_mei === null ? "-" : "Não",
        },
        {
            title: "Sócio",
            dataIndex: "is_socio",
            width: 70,
            render: (is_socio) =>
                is_socio
                    ? "Sim"
                    : is_socio === undefined || is_socio === null
                        ? "-"
                        : "Não",
        },
        {
            title: "Empresas",
            dataIndex: "company_partners",
            width: 210,
            ellipsis: {
                showTitle: false,
            },
            render: (company_partners) => {
                if (!company_partners || company_partners.length === 0) {
                    return "-";
                }

                const empresasFormatadas = company_partners
                    .map(
                        (empresa: { cnpj: string; nome: string; porte: string }) =>
                            `${empresa.cnpj}, ${empresa.nome}, ${empresa.porte}`,
                    )
                    .join("; \n");

                return (
                    <Tooltip
                        placement="topLeft"
                        title={
                            <div style={{ whiteSpace: "pre-line" }}>{empresasFormatadas}</div>
                        }
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
                            <Tooltip
                                title="Válido na ANATEL"
                                placement="top"
                                overlayInnerStyle={{ fontSize: 12 }}
                            >
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                            </Tooltip>
                        ) : isValid === 0 ? (
                            <Tooltip
                                title="Inválido na ANATEL"
                                placement="top"
                                overlayInnerStyle={{ fontSize: 12 }}
                            >
                                <XCircle className="h-4 w-4 text-red-500" />
                            </Tooltip>
                        ) : null}
                    </span>
                );
            },
            filters: [
                {
                    text: "Preenchido",
                    value: "preenchido",
                },
                {
                    text: "Vazio",
                    value: "vazio",
                },
            ],

            onFilter: (value, record) => {
                if (value === "preenchido") {
                    return (
                        record.phone !== null &&
                        record.phone !== undefined &&
                        record.phone !== ""
                    );
                }
                if (value === "vazio") {
                    return (
                        record.phone === null ||
                        record.phone === undefined ||
                        record.phone === ""
                    );
                }
                return true;
            },
        },
        {
            title: "Operadora",
            dataIndex: "operator",
            width: 120,
            ellipsis: {
                showTitle: false,
            },
            render: (_, record) => (
                <Tooltip
                    placement="topLeft"
                    title={record.operator}
                    overlayInnerStyle={{ fontSize: 12 }}
                >
                    {record.operator || "-"}
                </Tooltip>
            ),
        },
        {
            title: "Portado",
            dataIndex: "portability",
            width: 90,
            render: (
                portability) =>
                portability || "-",
        },
        {
            title: "Data da Portabilidade",
            dataIndex: "portability_date",
            width: 160,
            render: (_, record) =>
                record.portability_date
                    ? (record.portability_date)
                    : "-",
        },


        {
            title: "Whatsapp",
            dataIndex: ["whatsapp", "is_comercial"],
            width: 90,
            render: (is_comercial, record) => {
                const whatsappData = record?.whatsapp;

                // Cenário 1: Telefone invalido
                const hasInvalidPhoneError =
                    (whatsappData as { erro?: string } | null)?.erro === "Telefone inválido";

                if (hasInvalidPhoneError || whatsappData?.sucesso === false) {
                    return <div className="flex items-center justify-center">Não</div>;
                }

                // Cenário 2: existe_no_whatsapp é false
                if (whatsappData?.existe_no_whatsapp === false) {
                    return <div className="flex items-center justify-center">Não</div>;
                }

                // Casos com wpp valido
                return (
                    <div className="flex items-center justify-center">
                        {is_comercial === true ? (
                            <Tooltip
                                title="Business"
                                placement="top"
                                overlayInnerStyle={{ fontSize: 12 }}
                            >
                                <img
                                    src="/assets/whatsapp-business.png"
                                    alt="Business"
                                    className="h-6 w-6"
                                />
                            </Tooltip>
                        ) : is_comercial === false ? (
                            <Tooltip
                                title="Messenger"
                                placement="top"
                                overlayInnerStyle={{ fontSize: 12 }}
                            >
                                <img
                                    src="/assets/whatsapp-messenger.png"
                                    alt="Messenger"
                                    className="h-6 w-6"
                                />
                            </Tooltip>
                        ) : (
                            "-"
                        )}
                    </div>
                );
            },
        },
        {
            title: "Telefone Adicional",
            dataIndex: "additional_phone",
            width: 180,
            render: (_, record) => {
                if (!record.additional_phone) return "-";

                const isValid = Number(record.additional_phone_valid);

                return (
                    <span className="flex items-center gap-1">
                        {formatPhoneNumber(record.additional_phone)}
                        {isValid === 1 ? (
                            <Tooltip
                                title="Válido na ANATEL"
                                placement="top"
                                overlayInnerStyle={{ fontSize: 12 }}
                            >
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                            </Tooltip>
                        ) : isValid === 0 ? (
                            <Tooltip
                                title="Inválido na ANATEL"
                                placement="top"
                                overlayInnerStyle={{ fontSize: 12 }}
                            >
                                <XCircle className="h-4 w-4 text-red-500" />
                            </Tooltip>
                        ) : null}
                    </span>
                );
            },
            filters: [
                {
                    text: "Preenchido",
                    value: "preenchido",
                },
                {
                    text: "Vazio",
                    value: "vazio",
                },
            ],

            onFilter: (value, record) => {
                if (value === "preenchido") {
                    return (
                        record.phone !== null &&
                        record.phone !== undefined &&
                        record.phone !== ""
                    );
                }
                if (value === "vazio") {
                    return (
                        record.phone === null ||
                        record.phone === undefined ||
                        record.phone === ""
                    );
                }
                return true;
            },
        },

        {
            title: "Email",
            dataIndex: "email",
            ellipsis: {
                showTitle: false,
            },
            render: (_, record) => (
                <span className="flex items-center gap-1">
                    <Tooltip
                        placement="topLeft"
                        title={record.email || "-"}
                        overlayInnerStyle={{ fontSize: 12 }}
                    >
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
            width: 240,
        },

        {
            title: "Plano",
            dataIndex: ["plan", "name"],
            ellipsis: {
                showTitle: false,
            },
            render: (_, record) => (
                <Tooltip
                    placement="topLeft"
                    title={record.plan?.name}
                    overlayInnerStyle={{ fontSize: 12 }}
                >
                    {record.plan?.name
                        ? record.plan?.name
                        : "-"}
                </Tooltip>
            ),
            width: 180,
        },
        {
            title: "Valor do Plano",
            dataIndex: ["plan", "value"],
            width: 120,
            render: (_, record) =>
                record.plan?.value ? `R$ ${record.plan.value}` : "-",
        },
        {
            title: "Vencimento",
            dataIndex: "due_day",
            width: 120,
        },

        {
            title: "CEP",
            dataIndex: "zip_code",
            width: 130,
            render: (_, record) => {
                if (!record.zip_code) return "-";

                const isValidCep =
                    record.address && record.district && record.city && record.state;
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
                            <Tooltip
                                title="CEP válido com endereço completo"
                                placement="top"
                                overlayInnerStyle={{ fontSize: 12 }}
                            >
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                            </Tooltip>
                        ) : (
                            <Tooltip
                                title="CEP inválido ou incompleto"
                                placement="top"
                                overlayInnerStyle={{ fontSize: 12 }}
                            >
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
            ellipsis: {
                showTitle: false,
            },
            render: (address) => (
                <Tooltip
                    placement="topLeft"
                    title={address}
                    overlayInnerStyle={{ fontSize: 12 }}
                >
                    {address || "-"}
                </Tooltip>
            ),
            width: 140,
        },
        {
            title: "Número",
            dataIndex: "address_number",
            width: 80,
            render: (addressnumber) => (addressnumber ? addressnumber : "-"),
        },
        {
            title: "Bairro",
            dataIndex: "district",
            width: 120,
            ellipsis: {
                showTitle: false,
            },
            render: (district) => (
                <Tooltip
                    placement="topLeft"
                    title={district}
                    overlayInnerStyle={{ fontSize: 12 }}
                >
                    {district || "-"}
                </Tooltip>
            ),
        },

        {
            title: "Cidade",
            dataIndex: "city",
            width: 120,
            ellipsis: {
                showTitle: false,
            },
            render: (city) => (
                <Tooltip
                    placement="topLeft"
                    title={city}
                    overlayInnerStyle={{ fontSize: 12 }}
                >
                    {city || "-"}
                </Tooltip>
            ),
        },
        {
            title: "UF",
            dataIndex: "state",
            width: 60,
        },
        {
            title: "Coordenadas",
            dataIndex: "geolocation",
            width: 180,
            render: (geolocation) => {
                if (
                    !geolocation ||
                    !geolocation.latitude ||
                    !geolocation.longitude
                ) {
                    return "-";
                }
                const coordenadas = `Lat: ${geolocation.latitude}\nLong: ${geolocation.longitude}`;
                return (
                    <Tooltip
                        placement="topLeft"
                        title={coordenadas}
                        overlayInnerStyle={{ fontSize: 12 }}
                    >
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
            ellipsis: {
                showTitle: false,
            },
            render: (maps_link) =>
                maps_link ? (
                    <div className="flex items-center justify-center">
                        <Tooltip
                            placement="topLeft"
                            title={maps_link}
                            overlayInnerStyle={{ fontSize: 12 }}
                        >
                            <Button
                                style={{
                                    width: 32,
                                    height: 32,
                                    padding: 0,
                                }}
                                type="default"
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(maps_link, "_blank");
                                }}
                                tabIndex={0}
                            >
                                <MapIcon size={17} />
                            </Button>
                        </Tooltip>
                    </div>
                ) : (
                    <div className="flex items-center justify-center">
                        <span>-</span>
                    </div>
                ),
        },
        {
            title: "Street View",
            dataIndex: ["geolocation", "street_view_link"],
            width: 110,
            ellipsis: {
                showTitle: false,
            },
            render: (street_view_link) =>
                street_view_link ? (
                    <div className="flex items-center justify-center">
                        <Tooltip
                            placement="topLeft"
                            title={street_view_link}
                            overlayInnerStyle={{ fontSize: 12 }}
                        >
                            <Button
                                style={{
                                    width: 32,
                                    height: 32,
                                    padding: 0,
                                }}
                                type="default"
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(street_view_link, "_blank");
                                }}
                                tabIndex={0}
                            >
                                <MapPinned size={17} />
                            </Button>
                        </Tooltip>
                    </div>
                ) : (
                    <div className="flex items-center justify-center">
                        <span>-</span>
                    </div>
                ),
        },



        {
            title: "URL",
            dataIndex: "url",
            width: 140,
            ellipsis: {
                showTitle: false,
            },
            render: (url) => (
                <Tooltip
                    placement="topLeft"
                    title={url}
                    overlayInnerStyle={{ fontSize: 12 }}
                >
                    {url || "-"}
                </Tooltip>
            ),
        },
        {
            title: "IP do Cliente",
            dataIndex: "client_ip",
            width: 120,
            render: (client_ip) => (client_ip ? client_ip : "-"),
        },
        {
            title: "Provedor",
            dataIndex: "ip_isp",
            width: 120,
            ellipsis: {
                showTitle: false,
            },
            render: (ip_isp) => (
                <Tooltip
                    placement="topLeft"
                    title={ip_isp}
                    overlayInnerStyle={{ fontSize: 12 }}
                >
                    {ip_isp}
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
                        <Tooltip
                            title="Mobile"
                            placement="top"
                            overlayInnerStyle={{ fontSize: 12 }}
                        >
                            <Smartphone className="h-4 w-4 text-gray-600" />
                        </Tooltip>
                    ) : device === "desktop" ? (
                        <Tooltip
                            title="Desktop"
                            placement="top"
                            overlayInnerStyle={{ fontSize: 12 }}
                        >
                            <Monitor className="h-4 w-4 text-gray-600" />
                        </Tooltip>
                    ) : device === "tablet" ? (
                        <Tooltip
                            title="Tablet"
                            placement="top"
                            overlayInnerStyle={{ fontSize: 12 }}
                        >
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
            ellipsis: {
                showTitle: false,
            },
            render: (timezone, record) => {
                const timezoneName = record?.fingerprint?.timezone;
                const value = [timezone, timezoneName].filter(Boolean).join(" - ");

                return (
                    <Tooltip
                        placement="topLeft"
                        title={value || "-"}
                        overlayInnerStyle={{ fontSize: 12 }}
                    >
                        {value || "-"}
                    </Tooltip>
                );
            },
        },
        {
            title: "Resolução",
            dataIndex: ["fingerprint", "resolution"],
            width: 120,
            render: (resolution) => {
                if (resolution && resolution.width && resolution.height) {
                    return `${resolution.width} x ${resolution.height}`;
                }
                return "-";
            },
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
            render: (responsible_consultant) =>
                responsible_consultant ? responsible_consultant : "-",
        },
        {
            title: "ID CRM",
            dataIndex: "crm_id",
            width: 120,
            render: (crm_id) => (crm_id ? crm_id : "-"),
        },
        {
            title: "Atendimento",
            dataIndex: "service",
            width: 110,
            render: (service) => service || "-",
        },
        {
            title: "PAP",
            dataIndex: "availability_pap",
            width: 80,
            render: (availability, record) =>
                availability ? (
                    record.found_via_range ? (
                        <div className="flex items-center justify-center ">
                            <Tooltip
                                title="Disponível (via range numérico)"
                                placement="top"
                                overlayInnerStyle={{ fontSize: 12 }}
                            >
                                <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                            </Tooltip>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center ">
                            <Tooltip
                                title="Disponível"
                                placement="top"
                                overlayInnerStyle={{ fontSize: 12 }}
                            >
                                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                            </Tooltip>
                        </div>
                    )
                ) : (
                    <div className="flex items-center justify-center ">
                        <Tooltip
                            title="Indisponível"
                            placement="top"
                            overlayInnerStyle={{ fontSize: 12 }}
                        >
                            <div className="h-2 w-2 rounded-full">-</div>{" "}
                        </Tooltip>
                    </div>
                ),
        },
        {
            title: "Instalação",
            dataIndex: "installation",
            width: 110,
            render: (installation) => installation || "-",
        },
        {
            title: "Débito",
            dataIndex: "debit",
            width: 80,
            render: (debit) => {
                if (debit === null || debit === undefined) {
                    return "-";
                }

                return debit ? (
                    <div className="flex items-center justify-center ">
                        <Tooltip
                            placement="top"
                            overlayInnerStyle={{ fontSize: 12 }}
                            title="Possui débito"
                        >
                            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        </Tooltip>
                    </div>
                ) : (
                    <div className="flex items-center justify-center ">
                        <Tooltip
                            placement="top"
                            overlayInnerStyle={{ fontSize: 12 }}
                            title="Não possui débito"
                        >
                            <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                        </Tooltip>
                    </div>
                );
            },
        },
        {
            title: "Crédito",
            dataIndex: "credit",
            width: 80,
            render: (credit) => {
                if (credit === null || credit === undefined) {
                    return "-";
                }

                return credit ? (
                    <div className="flex items-center justify-center ">
                        <Tooltip
                            placement="top"
                            overlayInnerStyle={{ fontSize: 12 }}
                            title="Possui crédito"
                        >
                            <div className="bg-green-500 h-5 w-5 rounded-full text-white font-bold text-[16px] flex items-center justify-center">
                                <DollarSign size={15} />
                            </div>
                        </Tooltip>
                    </div>
                ) : (
                    <div className="flex items-center justify-center ">
                        <Tooltip
                            placement="top"
                            overlayInnerStyle={{ fontSize: 12 }}
                            title="Não possui crédito"
                        >
                            <div className="bg-red-500 h-5 w-5 rounded-full text-white font-bold text-[16px] flex items-center justify-center">
                                <DollarSign size={15} />
                            </div>
                        </Tooltip>
                    </div>
                );
            },
        },

    ];
}

export function getColumns(): TableColumnsType<EntityType> {
    return useAllTableColumns();
}
