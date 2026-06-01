export interface OrderLogChange {
  old?: string | number | boolean | null;
  new?: string | number | boolean | null;
}

export interface OrderLogItem {
  id: number;
  order_id: number;
  changed_by: string;
  user_type: string;
  changes: Record<string, OrderLogChange>;
  created_at: string;
}

export interface OrderLogsResponse {
  success: boolean;
  logs: OrderLogItem[];
}
