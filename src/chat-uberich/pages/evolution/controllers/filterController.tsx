import { useState } from "react";
import { StatusType } from "src/interfaces/purchase";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Button,
  ConfigProvider,
  Switch,
  TableColumnsType,
  Tooltip,
} from "antd";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { Trash } from "lucide-react";
import { formatDateTimeBR } from "@/utils/formatDateTimeBR";
import { useStyle } from "@/style/tableStyle";

function getFiltersFromURL(): {
  status: StatusType | null;
  telefone: string | null;
  cnpj: string | null;
  company_name?: string | null;
  id?: string | null;
  page: number;
  limit: number;
  data_de?: string | null;
  data_ate?: string | null;
  alreadyHaveWorkspace?: string | number | null;
  isVivoClient?: string | number | null;
  order?: "asc" | "desc" | null;
  sort?: string | null;
} {
  const params = new URLSearchParams(window.location.search);

  const rawStatus = params.get("status");
  const allowedStatus: StatusType[] = ["aberto", "fechado", "cancelado"];
  const status = allowedStatus.includes(rawStatus as StatusType)
    ? (rawStatus as StatusType)
    : null;

  const id = params.get("id") || null;
  const telefone = params.get("telefone");
  const company_name = params.get("company_name");
  const isVivoClient = params.get("isVivoClient");
  const alreadyHaveWorkspace = params.get("alreadyHaveWorkspace");
  const cnpj = params.get("cnpj");
  const data_de = params.get("data_de");
  const data_ate = params.get("data_ate");
  const page = parseInt(params.get("page") || "1", 10);
  const limit = parseInt(params.get("limit") || "100", 10);
  const order = params.get("order") as "asc" | "desc" | null;
  const sort = params.get("sort") || null;

  return {
    status,
    id,
    telefone,
    company_name,
    isVivoClient,
    alreadyHaveWorkspace,
    data_de,
    data_ate,
    cnpj,
    page,
    limit,

    order: order === "asc" || order === "desc" ? order : null,
    sort: sort || null,
  };
}

export function useEvolutionFilterController({
  onDeleteItem,
  onOpenQRCodeItem,
  setInstanceName,
  onOpenDisconnectItem,
}: any) {
  const navigate = useNavigate();
  const filters = getFiltersFromURL();

  const [selectedEvolution, setSelectedEvolution] = useState<any | null>(null);

  const currentPage = filters.page;
  const pageSize = filters.limit;

  const { handleSubmit, reset, control } = useForm<any>({
    defaultValues: {
      status: undefined,
      cnpj: "",
      id: "",
      company_name: "",
      isVivoClient: null,
      alreadyHaveWorkspace: null,
      data_de: "",
      data_ate: "",
      order: undefined,
      sort: "",
    },
  });
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const onSubmit = (data: any) => {
    const params = new URLSearchParams();

    if (data.status) params.set("status", data.status);
    if (data.cnpj) {
      const cnpjSemMascara = data.cnpj.replace(/\D/g, "");
      params.set("cnpj", cnpjSemMascara);
    }
    if (data.id) params.set("id", String(data.id));
    if (data.company_name) params.set("company_name", data.company_name);
    if (data.isVivoClient !== undefined && data.isVivoClient !== null)
      params.set("isVivoClient", String(data.isVivoClient));
    if (
      data.alreadyHaveWorkspace !== undefined &&
      data.alreadyHaveWorkspace !== null
    )
      params.set("alreadyHaveWorkspace", String(data.alreadyHaveWorkspace));
    if (data.data_de) params.set("data_de", data.data_de);
    if (data.data_ate) params.set("data_ate", data.data_ate);
    params.set("page", "1");
    params.set("limit", "100");
    if (data.order) params.set("order", data.order);
    if (data.sort) params.set("sort", data.sort);

    navigate(`?${params.toString()}`);
    setIsFiltered(true);
  };

  const clearFilters = () => {
    reset();
    navigate("");
    setIsFiltered(false);
  };

  const { styles } = useStyle();

  const columns: TableColumnsType<any> = [
    {
      title: "",
      dataIndex: "profilePicUrl",
      width: 80,
      render: (profilePicUrl) => {
        return (
          <img
            src={profilePicUrl || "/assets/anonymous_avatar.png"}
            className="h-9 w-9 rounded-full"
          />
        );
      },
    },
    // {
    //   title: "ID",
    //   dataIndex: "id",
    //   width: 90,
    // },

    {
      title: "Nome",
      dataIndex: "name",
      width: 150,
      render: (name: string) => (name ? name : "-"),
    },
    {
      title: "Título WA",
      dataIndex: "profileName",
      width: 120,
      render: (profileName) => (profileName ? profileName : "-"),
    },
    {
      title: "Telefone",
      dataIndex: "number",
      width: 140,
      render: (number: string) => (number ? formatPhoneNumber(number) : "-"),
    },

    {
      title: "Status",
      dataIndex: ["whatsapp", "recado"],
      ellipsis: {
        showTitle: false,
      },
      render: (recado) => (
        <Tooltip
          placement="topLeft"
          title={recado}
          styles={{ body: { fontSize: "12px" } }}
        >
          {recado || "-"}
        </Tooltip>
      ),
      width: 140,
    },

    {
      title: "Data de Criação",
      dataIndex: "createdAt",
      width: 140,
      sorter: true,
      render: (createdAt: string) => {
        return formatDateTimeBR(createdAt);
      },
      sortOrder:
        filters.sort === "createdAt"
          ? filters.order === "asc"
            ? "ascend"
            : filters.order === "desc"
              ? "descend"
              : undefined
          : undefined,
      onHeaderCell: () => ({
        onClick: () => {
          const newOrder =
            filters.sort === "createdAt" && filters.order === "asc"
              ? "desc"
              : "asc";
          const params = new URLSearchParams(window.location.search);
          params.set("sort", "createdAt");
          params.set("order", newOrder);
          params.set("page", "1");
          navigate(`?${params.toString()}`);
        },
        style: { cursor: "pointer" },
      }),
    },
    {
      title: "",
      dataIndex: "connectionStatus",
      width: 50,
      render: (_value, record) => (
        <ConfigProvider
          theme={{
            components: {
              Switch: { colorPrimary: "#660099", colorPrimaryHover: "#550088" },
            },
          }}
        >
          <Tooltip
            title="Ative ou desative o Whatsapp da plataforma"
            placement="top"
            styles={{ body: { fontSize: "12px" } }}
          >
            <Switch
              size="small"
              onClick={() => {
                if (record.connectionStatus === "open") {
                  if (typeof onOpenDisconnectItem === "function") {
                    onOpenDisconnectItem(record);
                  }
                } else {
                  if (typeof setInstanceName === "function") {
                    setInstanceName(record.name);
                  }
                  onOpenQRCodeItem(record);
                }
              }}
              checked={record.connectionStatus === "open"}
            />
          </Tooltip>
        </ConfigProvider>
      ),
    },
    {
      title: "",
      dataIndex: "acao",
      width: 40,
      render: (_, record) => (
        <ConfigProvider
          theme={{
            components: {
              Button: {
                colorBorder: "#660099",
                colorText: "#660099",
                colorPrimary: "#660099",
                colorPrimaryHover: "#883fa2",
              },
            },
          }}
        >
          <div className="flex gap-4">
            <Tooltip
              title="Excluir"
              placement="top"
              styles={{ body: { fontSize: "12px" } }}
            >
              <Button
                onClick={() => onDeleteItem(record)}
                type="text"
                icon={<Trash size={16} />}
                className="w-8 h-8 flex items-center justify-center p-0"
              />
            </Tooltip>
          </div>
        </ConfigProvider>
      ),
    },
  ];

  return {
    isFiltered,
    control,
    onSubmit,
    handleSubmit,
    clearFilters,
    selectedEvolution,
    setSelectedEvolution,
    currentPage,
    pageSize,
    columns,
    styles: { customTable: styles.customTable },
  };
}
