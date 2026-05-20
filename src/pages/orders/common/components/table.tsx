import { useMemo, useState, type ComponentType } from "react";
import { Table } from "antd";
import type { Key } from "react";
import type { TableColumnsType } from "antd";
import { TableToolbar, type CategorySelectProps } from "./table-toolbar";
import { DeleteConfirmModal } from "./delete-confirm-modal";
import { entityPage } from "../../config-page.const";
import { useStyle } from "@/style/tableStyle";
import { useAuth } from "@/context/auth-provider";
import { can } from "@/helpers/access-control.helper";

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
  FormModalComponent: ComponentType<FormModalProps>;
  ViewModalComponent: ComponentType<ViewModalProps>;
}

export function TableMain({
  data,
  isLoading,
  columns,
  categorySelect,
  FormModalComponent,
  ViewModalComponent,
}: CompaniesTableProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [searchText, setSearchText] = useState("");
  const [viewingEntity, setViewingEntity] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<any>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [entitiesToDelete, setEntitiesToDelete] = useState<any[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { user } = useAuth();
  const canDeleteOrders = can(user?.user?.role, "orders", "delete");
  const { styles } = useStyle();
  const filteredData = useMemo(() => {
    if (!searchText) return data;
    const lower = searchText.toLowerCase();
    return data.filter((u) => u.email?.toLowerCase().includes(lower));
  }, [data, searchText]);

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

  return (
    <>
      <TableToolbar
        searchText={searchText}
        onSearchChange={setSearchText}
        selectedCount={selectedRowKeys.length}
        onBulkDelete={handleBulkDelete}
        canDelete={canDeleteOrders}
        categorySelect={categorySelect}
        deleteLabel={`Deletar ${entityPage.plural.toLowerCase()}`}
      />
      <div className="flex overflow-y-auto">
        <Table
          rowKey="id"
          columns={columns}
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
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total: ${total} ${entityPage.plural.toLowerCase()}`,
          }}
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
