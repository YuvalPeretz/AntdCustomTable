// src/CustomTable.tsx
import { Table, TableProps } from "antd";
import React, { useEffect, useState } from "react";

export type CustomTableProps = {
  parentRef?: React.RefObject<HTMLElement>;
} & TableProps<any>;

const AntdCustomTable: React.FC<CustomTableProps> = (props: CustomTableProps) => {
  const { parentRef, ...tableProps } = props;
  const [tableHeight, setTableHeight] = useState<number | undefined>(parentRef?.current?.clientHeight);

  useEffect(() => {
    if (!parentRef?.current) return;

    const observeTarget = parentRef.current;

    const handleResize = (entries: ResizeObserverEntry[]) => {
      for (let entry of entries) {
        const newHeight = entry.contentRect.height;
        setTableHeight(newHeight);
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);

    resizeObserver.observe(observeTarget);

    // Set initial height
    setTableHeight(observeTarget.clientHeight);

    return () => {
      resizeObserver.unobserve(observeTarget);
      resizeObserver.disconnect();
    };
  }, [parentRef]);

  return (
    <Table
      {...tableProps}
      scroll={{
        y: tableHeight ? tableHeight - 50 : undefined, // Adjust the value as needed
        ...(tableProps.scroll || {}),
      }}
    />
  );
};

export default AntdCustomTable;
