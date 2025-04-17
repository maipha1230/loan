'use client';

import { Table } from 'antd';
import type { TableProps } from 'antd';
import React from 'react';

type CommonTableProps<T> = {
  columns: TableProps<T>['columns'];
  data: T[];
  loading?: boolean;
  rowKey?: string | ((record: T) => string);
};

function CommonTable<T extends object>({
  columns,
  data,
  loading = false,
  rowKey = 'key',
}: CommonTableProps<T>) {
  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey={rowKey}
      pagination={{ pageSize: 10 }}
    />
  );
}

export default CommonTable;
