import { useMemo, useState } from "react";
import { Table } from "antd";
import type { Key } from "react";
import type { IPartner } from "@/types/IPartner.type";
import { getColumns } from "./columns";
import { TableToolbar } from "./table-toolbar";
import { FormModal } from "./form-modal";
import { DeleteConfirmModal } from "./delete-confirm-modal";
import { entityPage } from "../config-page.const";
import { useStyle } from "@/style/tableStyle";
import { ViewModal } from "./view-modal";

interface PartnersTableProps {
  data: IPartner[];
  isLoading: boolean;
}

export function TableMain({ data, isLoading }: PartnersTableProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [searchText, setSearchText] = useState("");
  const [viewingEntity, setViewingEntity] = useState<IPartner | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<IPartner | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [entitiesToDelete, setEntitiesToDelete] = useState<IPartner[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { styles } = useStyle();
  const filteredData = useMemo(() => {
    if (!searchText) return data;
    const lower = searchText.toLowerCase();
    return data.filter(
      (u) =>
        u.partner_name.toLowerCase().includes(lower) ||
        u.email.toLowerCase().includes(lower),
    );
  }, [data, searchText]);

  function handleEdit(record: IPartner) {
    setEditingEntity(record);
    setIsFormModalOpen(true);
    setIsViewModalOpen(false);
  }
  function handleView(record: IPartner) {
    setViewingEntity(record);
    setIsViewModalOpen(true);
  }
  function handleDelete(record: IPartner) {
    setIsViewModalOpen(false);
    setEntitiesToDelete([record]);
    setIsDeleteModalOpen(true);
  }

  function handleBulkDelete() {
    const selected = data.filter((u) => selectedRowKeys.includes(u.partner_id));
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
          rowKey="partner_id"
          columns={columns}
          dataSource={filteredData}
          className={styles.customTable}
          loading={isLoading}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          pagination={{
            pageSize: 10,
            showTotal: (total) =>
              `Total: ${total} ${entityPage.plural.toLowerCase()}`,
          }}
          scroll={{ y: 800 }}
          onRow={(record) => ({
            onClick: () => handleView(record),
            style: { cursor: 'pointer' },
          })}
        />
      </div>
      <FormModal
        open={isFormModalOpen}
        editingEntity={editingEntity}
        onClose={handleFormClose}
      />

      <ViewModal
        open={isViewModalOpen}
        viewingEntity={viewingEntity}
        onClose={handleViewClose}
        onEdit={(entity: IPartner) => {
          handleEdit(entity);
        }}
        onDelete={(entity: IPartner) => {
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
