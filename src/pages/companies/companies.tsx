import { Typography } from "antd";

import { entityPage, useListEntity } from "./config-page.const";
import { TableMain } from "./components/table";
import { useState } from "react";

export function CompaniesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const { data, isLoading } = useListEntity({
    page: currentPage,
    per_page: pageSize,
  });
  return (
    <div className="py-6 min-h-[calc(100vh-160px)]">
      <Typography.Title level={3} style={{ marginBottom: 16 }}>
        {entityPage.plural}
      </Typography.Title>
      <TableMain data={data?.companies || []} isLoading={isLoading} currentPage={currentPage}
        pageSize={pageSize}
        total={data?.total || 0}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize} />
    </div>
  );
}
