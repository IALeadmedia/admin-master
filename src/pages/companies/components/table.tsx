import { useMemo, useState } from "react";
import { Table } from "antd";
import type { Key } from "react";
import type { ICompany } from "@/types/ICompany.type";
import { getColumns } from "./columns";
import { TableToolbar } from "./table-toolbar";
import { FormModal } from "./form-modal";
import { DeleteConfirmModal } from "./delete-confirm-modal";
import { useStyle } from "@/style/tableStyle";
import { ViewModal } from "./view-modal";

interface CompaniesTableProps {
    data: ICompany[];
    isLoading: boolean; currentPage: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

export function TableMain({ data, isLoading, currentPage,
    pageSize,
    total,
    onPageChange,
    onPageSizeChange, }: CompaniesTableProps) {
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
    const [searchText, setSearchText] = useState("");
    const [viewingEntity, setViewingEntity] = useState<ICompany | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [editingEntity, setEditingEntity] = useState<ICompany | null>(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [entitiesToDelete, setEntitiesToDelete] = useState<ICompany[]>([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const { styles } = useStyle();
    const filteredData = useMemo(() => {
        if (!searchText) return data;
        const lower = searchText.toLowerCase();
        return data.filter(
            (u) =>
                u.company_name.toLowerCase().includes(lower) ||
                u.email?.toLowerCase().includes(lower),
        );
    }, [data, searchText]);

    function handleEdit(record: ICompany) {
        setEditingEntity(record);
        setIsFormModalOpen(true);
        setIsViewModalOpen(false);
    }
    function handleView(record: ICompany) {
        setViewingEntity(record);
        setIsViewModalOpen(true);
    }
    function handleDelete(record: ICompany) {
        setIsViewModalOpen(false);
        setEntitiesToDelete([record]);
        setIsDeleteModalOpen(true);
    }

    function handleBulkDelete() {
        const selected = data.filter((u) => selectedRowKeys.includes(u.company_id));
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
                    rowKey="company_id"
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
                        pageSizeOptions: [5, 10, 20, 50, 100],
                        showSizeChanger: true,

                        showTotal: (total) => `Total: ${total}`,
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
                onEdit={(entity: ICompany) => {
                    handleEdit(entity);
                }}
                onDelete={(entity: ICompany) => {
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
