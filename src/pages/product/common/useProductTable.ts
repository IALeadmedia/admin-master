import { useMemo, useState } from "react";
import type { Key } from "react";
import type { IProduct } from "@/types/IProduct.type";

export function useProductTable(data: IProduct[]) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [searchText, setSearchText] = useState("");
  const [viewingEntity, setViewingEntity] = useState<IProduct | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<IProduct | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [entitiesToDelete, setEntitiesToDelete] = useState<IProduct[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const filteredData = useMemo(() => {
    if (!searchText) return data;
    const lower = searchText.toLowerCase();
    return data.filter((item) => item.name.toLowerCase().includes(lower));
  }, [data, searchText]);

  function handleEdit(record: IProduct) {
    setEditingEntity(record);
    setIsFormModalOpen(true);
    setIsViewModalOpen(false);
  }

  function handleView(record: IProduct) {
    setViewingEntity(record);
    setIsViewModalOpen(true);
  }

  function handleDelete(record: IProduct) {
    setIsViewModalOpen(false);
    setEntitiesToDelete([record]);
    setIsDeleteModalOpen(true);
  }

  function handleBulkDelete() {
    const selected = data.filter((u) => selectedRowKeys.includes(u.id));
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

  return {
    selectedRowKeys,
    setSelectedRowKeys,
    searchText,
    setSearchText,
    viewingEntity,
    isViewModalOpen,
    editingEntity,
    isFormModalOpen,
    entitiesToDelete,
    isDeleteModalOpen,
    filteredData,
    handleEdit,
    handleView,
    handleDelete,
    handleBulkDelete,
    handleCreate,
    handleFormClose,
    handleDeleteClose,
    handleViewClose,
  };
}
