import { Typography } from "antd";
import { TableMain } from "./components/table";
import { entityPage, useListEntity } from "./config-page.const";

export function UsersPage() {
  const { data, isLoading } = useListEntity();

  return (
    <div className="py-6 min-h-[calc(100vh-160px)]">
      <Typography.Title level={3} style={{ marginBottom: 16 }}>
        {entityPage.plural}
      </Typography.Title>
      <TableMain data={data?.users || []} isLoading={isLoading} />
    </div>
  );
}
