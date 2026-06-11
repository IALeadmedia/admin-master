import { useEffect, useMemo, useState, type ComponentType } from "react";
import { Button, Checkbox, Dropdown, Table, Tooltip } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import type { Key } from "react";
import type { TableColumnsType } from "antd";
import { TableToolbar, type CategorySelectProps } from "./table-toolbar";
import { DeleteConfirmModal } from "./delete-confirm-modal";
import { entityPage } from "../../config-page.const";
import { useStyle } from "@/style/tableStyle";
import { useAuth } from "@/context/auth-provider";
import { can } from "@/helpers/access-control.helper";
import type { ICompany } from "@/types/ICompany.type";
import { exportOrdersXLSX } from "../exportOrdersXLSX";

// --------------- helpers de coluna ---------------
function getColKey(col: TableColumnsType<any>[number]): string {
  if ("key" in col && col.key) return String(col.key);
  if ("dataIndex" in col) {
    const di = (col as { dataIndex?: unknown }).dataIndex;
    if (Array.isArray(di)) return di.join(".");
    return String(di ?? "");
  }
  return "";
}

// Colunas sempre visíveis (sem título, identificadores visuais)
const ALWAYS_VISIBLE_KEYS = ["consultant_observation", "whatsapp"];

function getSelectableKeys(cols: TableColumnsType<any>): string[] {
  return cols
    .filter(
      (col) =>
        "dataIndex" in col &&
        !ALWAYS_VISIBLE_KEYS.includes(getColKey(col)),
    )
    .map(getColKey)
    .filter(Boolean);
}
// -------------------------------------------------

type FormModalProps = {
  open: boolean;
  editingEntity: any;
  onClose: () => void;
};

type ViewModalProps = {
  open: boolean;
  viewingEntity: any;
  onClose: () => void;
  onEdit?: (entity: any) => void;
  onDelete?: (entity: any) => void;
  canDelete?: boolean;
};

interface CompaniesTableProps {
  data: any[];
  isLoading: boolean;
  columns?: TableColumnsType<any>;
  categorySelect?: CategorySelectProps;
  clientTypeSelect?: CategorySelectProps;
  FormModalComponent: ComponentType<FormModalProps>;
  ViewModalComponent: ComponentType<ViewModalProps>;
  currentPage?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  companies?: ICompany[];
  exportExtraColumns?: Array<{ title: string; getValue: (record: unknown) => string | number }>;
  exportExcludeDataIndexes?: string[];
  onExportAll?: () => Promise<any[]>;
}

export function TableMain({
  data,
  isLoading,
  columns,
  categorySelect,
  clientTypeSelect,
  FormModalComponent,
  ViewModalComponent,
  currentPage,
  pageSize = 100,
  total,
  onPageChange,
  onPageSizeChange,
  companies = [],
  exportExtraColumns = [],
  exportExcludeDataIndexes = [],
  onExportAll,
}: CompaniesTableProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [searchText, setSearchText] = useState("");
  const [viewingEntity, setViewingEntity] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<any>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [entitiesToDelete, setEntitiesToDelete] = useState<any[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (viewingEntity) {
      const updated = data.find((item: any) => item.id === viewingEntity.id);
      if (updated) setViewingEntity(updated);
    }
  }, [data]);
  const { user } = useAuth();
  const canDeleteOrders = can(user?.user?.role, "orders", "delete");
  const { styles } = useStyle();

  // ----------- seletor de colunas visíveis -----------
  const allTableColumns = columns ?? [];

  const allColumnOptions = allTableColumns
    .filter(
      (col) =>
        "dataIndex" in col && !ALWAYS_VISIBLE_KEYS.includes(getColKey(col)),
    )
    .map((col) => ({
      label:
        typeof col.title === "function" || !col.title
          ? getColKey(col)
          : String(col.title),
      value: getColKey(col),
    }))
    .filter((opt) => opt.value);

  const [visibleColumns, setVisibleColumns] = useState<string[]>(() =>
    getSelectableKeys(columns ?? []),
  );

  // Quando o conjunto de colunas muda (troca de segmento no admin), reseta visibilidade
  const colSignature = useMemo(
    () => getSelectableKeys(allTableColumns).join(","),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allTableColumns.length],
  );

  useEffect(() => {
    setVisibleColumns(getSelectableKeys(columns ?? []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colSignature]);

  const visibleTableColumns: TableColumnsType<any> = [
    // Colunas sem dataIndex (ex: Disponibilidade) e sempre visíveis passam direto
    ...allTableColumns.filter(
      (col) =>
        !("dataIndex" in col) || ALWAYS_VISIBLE_KEYS.includes(getColKey(col)),
    ),
    // Colunas selecionáveis que o usuário manteve visíveis
    ...allTableColumns.filter(
      (col) =>
        "dataIndex" in col &&
        !ALWAYS_VISIBLE_KEYS.includes(getColKey(col)) &&
        visibleColumns.includes(getColKey(col)),
    ),
  ];

  const filteredData = useMemo(() => {
    if (!searchText) return data;
    const lower = searchText.toLowerCase();
    return data.filter(
      (u) =>
        u.full_name?.toLowerCase().includes(lower) ||
        u.email?.toLowerCase().includes(lower),
    );
  }, [data, searchText]);

  const handleExport = async () => {
    try {
      setIsExporting(true);

      if (selectedRowKeys.length > 0) {
        const exportDataSource = filteredData.filter((r: { id: unknown }) =>
          selectedRowKeys.includes(r.id as Key),
        );

        exportOrdersXLSX({
          data: exportDataSource,
          visibleColumns: visibleTableColumns,
          extraExportColumns: exportExtraColumns,
          excludeDataIndexes: exportExcludeDataIndexes,
          filename: "pedidos.xlsx",
        });

        return;
      }

      const allData = await onExportAll?.();

      exportOrdersXLSX({
        data: allData ?? [],
        visibleColumns: visibleTableColumns,
        extraExportColumns: exportExtraColumns,
        excludeDataIndexes: exportExcludeDataIndexes,
        filename: "pedidos.xlsx",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const columnSelectorDropdown = (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <Tooltip
        title={
          selectedRowKeys.length > 0
            ? `Exportar ${selectedRowKeys.length} selecionados em .xlsx`
            : "Exportar todos os pedidos em .xlsx"
        }
        placement="top"
        overlayStyle={{ fontSize: "12px" }}
      >
        <Button
          loading={isExporting}
          icon={<DownloadOutlined />}
          onClick={handleExport}
        />
      </Tooltip>
      <Dropdown
        trigger={["click"]}
        placement="bottomRight"
        dropdownRender={() => (
          <div
            style={{
              width: 240,
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              padding: 12,
              maxHeight: 320,
              overflowY: "auto",
            }}
          >
            <Checkbox.Group
              options={allColumnOptions}
              value={visibleColumns}
              onChange={(vals) => setVisibleColumns(vals as string[])}
              style={{ display: "flex", flexDirection: "column", gap: 8 }}
            />
          </div>
        )}
      >
        <Button>Selecionar Colunas</Button>
      </Dropdown>
    </div>
  );
  // ---------------------------------------------------

  function handleEdit(record: any) {
    setEditingEntity(record);
    setIsFormModalOpen(true);
    setIsViewModalOpen(false);
  }

  function handleView(record: any) {
    setViewingEntity(record);
    setIsViewModalOpen(true);
  }

  function handleDelete(record: any) {
    setIsViewModalOpen(false);
    setEntitiesToDelete([record]);
    setIsDeleteModalOpen(true);
  }

  function handleBulkDelete() {
    const selected = data.filter((u) => selectedRowKeys.includes(u.id));
    setEntitiesToDelete(selected);
    setIsDeleteModalOpen(true);
  }

  function handleFormClose() {
    setIsFormModalOpen(false);
    setEditingEntity(null);
  }

  function handleDeleteClose() {
    setIsDeleteModalOpen(false);
    setEntitiesToDelete([]);
    setSelectedRowKeys([]);
  }

  function handleViewClose() {
    setIsViewModalOpen(false);
    setViewingEntity(null);
  }

  const rowClassName = (record: any) => {
    if (record?.status === "fechado" || record?.status === "FECHADO") {
      const companyName = companies.find(
        (c) => c.company_id === record?.company_id,
      )?.company_name;
      const operatorKey = companyName?.split(" ")[0]?.toLowerCase().trim();
      const operatorAvailability = operatorKey
        ? record?.operators_availability?.[operatorKey]
        : undefined;

      if (operatorAvailability?.available === false) {
        return "ant-table-row-red";
      } else if (operatorAvailability?.found_via_range === true || record?.single_zip_code) {
        return "ant-table-row-yellow";
      } else if (operatorAvailability?.available === true) {
        return "ant-table-row-green";
      }
    }
    return "";
  };

  return (
    <>
      <TableToolbar
        searchText={searchText}
        onSearchChange={setSearchText}
        selectedCount={selectedRowKeys.length}
        onBulkDelete={handleBulkDelete}
        canDelete={canDeleteOrders}
        categorySelect={categorySelect}
        clientTypeSelect={clientTypeSelect}
        deleteLabel={`Deletar ${entityPage.plural.toLowerCase()}`}
        leftExtra={columnSelectorDropdown}
      />
      <div className="flex overflow-y-auto">
        <Table
          rowKey="id"
          rowClassName={(record) => rowClassName(record) ?? ""}
          columns={visibleTableColumns}
          dataSource={filteredData}
          className={styles.customTable}
          loading={isLoading}
          rowSelection={
            canDeleteOrders
              ? {
                selectedRowKeys,
                onChange: setSelectedRowKeys,
              }
              : undefined
          }
          pagination={
            currentPage !== undefined
              ? {
                current: currentPage,
                pageSize,
                total,
                locale: { items_per_page: "" },
                pageSizeOptions: [20, 50, 100, 200, 500],
                showSizeChanger: true,
                showTotal: (t) => `Total de ${t} ${entityPage.plural.toLowerCase()}`,
                onChange: (p) => onPageChange?.(p),
                onShowSizeChange: (_: number, size: number) => {
                  onPageSizeChange?.(size);
                  onPageChange?.(1);
                },
              }
              : {
                pageSize: 100,
                showTotal: (t) => `Total de ${t} ${entityPage.plural.toLowerCase()}`,
              }
          }
          scroll={{ y: 800 }}
          onRow={(record) => ({
            onClick: () => handleView(record),
            style: { cursor: "pointer" },
          })}
        />
      </div>
      <FormModalComponent open={isFormModalOpen} editingEntity={editingEntity} onClose={handleFormClose} />
      <ViewModalComponent
        open={isViewModalOpen}
        viewingEntity={viewingEntity}
        onClose={handleViewClose}
        onEdit={(entity: any) => {
          handleEdit(entity);
        }}
        onDelete={(entity: any) => {
          handleDelete(entity);
        }}
        canDelete={canDeleteOrders}
      />
      <DeleteConfirmModal
        open={isDeleteModalOpen}
        entitiesToDelete={entitiesToDelete}
        onClose={handleDeleteClose}
        entityLabel={entityPage.name.toLowerCase()}
      />
    </>
  );
}
