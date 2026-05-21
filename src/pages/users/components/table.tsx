import { useMemo, useState } from "react";
import { Table } from "antd";
import type { Key } from "react";
import type { IUser } from "@/types/IUser.type";
import { getColumns } from "./columns";
import { TableToolbar } from "./table-toolbar";
import { FormModal } from "./form-modal";
import { ViewModal } from "./view-modal";
import { DeleteConfirmModal } from "./delete-confirm-modal";
import { entityPage } from "../config-page.const";
import { useStyle } from "@/style/tableStyle";

interface UsersTableProps {
  data: IUser[];
  isLoading: boolean; pageSize: number; currentPage: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function TableMain({ data, isLoading, currentPage,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange, }: UsersTableProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [searchText, setSearchText] = useState("");
  const [viewingEntity, setViewingEntity] = useState<IUser | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<IUser | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [entitiesToDelete, setEntitiesToDelete] = useState<IUser[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { styles } = useStyle();
  const filteredData = useMemo(() => {
    if (!searchText) return data;
    const lower = searchText.toLowerCase();
    return data.filter(
      (u) =>
        u.user_name.toLowerCase().includes(lower) ||
        u.email.toLowerCase().includes(lower),
    );
  }, [data, searchText]);

  function handleEdit(record: IUser) {
    setIsViewModalOpen(false);
    setEditingEntity(record);
    setIsFormModalOpen(true);
  }

  function handleView(record: IUser) {
    setViewingEntity(record);
    setIsViewModalOpen(true);
  }

  function handleDelete(record: IUser) {
    setIsViewModalOpen(false);
    setEntitiesToDelete([record]);
    setIsDeleteModalOpen(true);
  }

  function handleBulkDelete() {
    const selected = data.filter((u) => selectedRowKeys.includes(u.user_id));
    setEntitiesToDelete(selected);
    setIsDeleteModalOpen(true);
  }

  function handleCreate() {
    setEditingEntity(null);
    setIsFormModalOpen(true);
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

  const columns = getColumns();

  return (
    <>
      <TableToolbar
        searchText={searchText}
        onSearchChange={setSearchText}
        selectedCount={selectedRowKeys.length}
        onBulkDelete={handleBulkDelete}
        onCreate={handleCreate}
      />
      <div className="flex overflow-y-auto ">
        <Table
          rowKey="user_id"
          columns={columns}
          dataSource={filteredData}
          className={styles.customTable}
          loading={isLoading}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            locale: { items_per_page: "" },
            pageSizeOptions: [5, 10, 20, 50, 100],
            showSizeChanger: true,
            showTotal: (total) => `Total de ${total} ${entityPage.plural.toLowerCase()}`,
            onChange: (page) => onPageChange(page),
            onShowSizeChange: (_, size) => {
              onPageSizeChange(size);
              onPageChange(1);
            },
          }}
          scroll={{ y: 800 }}
          onRow={(record) => ({
            onClick: () => handleView(record),
            style: { cursor: 'pointer' },
          })}
        />
      </div >
      <FormModal
        open={isFormModalOpen}
        editingEntity={editingEntity}
        onClose={handleFormClose}
      />

      <ViewModal
        open={isViewModalOpen}
        viewingEntity={viewingEntity}
        onClose={handleViewClose}
        onEdit={(entity: IUser) => {
          handleEdit(entity);
        }}
        onDelete={(entity: IUser) => {
          handleDelete(entity);
        }}
      />

      <DeleteConfirmModal
        open={isDeleteModalOpen}
        entitiesToDelete={entitiesToDelete}
        onClose={handleDeleteClose}
      />
    </>
  );
}
