"use client";

import { useState } from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
  ExpandedState,
  getFilteredRowModel,
  Column,
  RowData,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "checkbox";
  }
}

interface HideMessageCheckboxProps<TData, Value> {
  column: Column<TData, Value>;
  hideMessages: boolean;
  setHideMessages: (shouldHide: boolean) => any;
  impressionsThreshold?: string;
}

interface MessageTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  defaultExpanded?: boolean;
  canHideMessages?: boolean;
  impressionsThreshold?: string;
}

function HideMessageCheckbox<TData, Value>({
  column,
  hideMessages,
  setHideMessages,
  impressionsThreshold,
}: HideMessageCheckboxProps<TData, Value>) {
  // XXX fix assertion that impressionsThreshold won't be undefined here
  return (
    <div className="flex items-center gap-x-1">
      <Checkbox
        className="border-slate-400"
        id="hide"
        onCheckedChange={() => {
          if (!hideMessages) {
            column.setFilterValue(parseInt(impressionsThreshold!));
          } else {
            column.setFilterValue(null);
          }
          setHideMessages(!hideMessages);
        }}
      />
      <label
        htmlFor="hide"
        className="text-3xs font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Hide messages with fewer than {impressionsThreshold || "1000"}{" "}
        impressions
      </label>
    </div>
  );
}

export function MessageTable<TData, TValue>({
  columns,
  data,
  defaultExpanded,
  canHideMessages,
  impressionsThreshold,
}: MessageTableProps<TData, TValue>) {
  // Tables will start collapsed if defaultExpanded is undefined
  const [expanded, setExpanded] = useState<ExpandedState>(
    defaultExpanded || {},
  );
  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSubRows: (originalRow: any) => originalRow.branches,
    getExpandedRowModel: getExpandedRowModel(),
    filterFromLeafRows: true,
  });

  function getRowSpanForCell(cell: any) {
    // XXX is an experiment & the dates column
    // if (cell.row.original.recipe && cell.column.id == 'dates') {
    //   return cell.row.original.recipe.branches.length
    // }

    return 1;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="sticky top-36">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    className="py-4 bg-stone-100 text-slate-400"
                    key={header.id}
                  >
                    {header.isPlaceholder ? null : (
                      <div className="flex flex-col gap-y-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getCanFilter() ? (
                          <Filter
                            column={header.column}
                            impressionsThreshold={impressionsThreshold}
                            canHideMessages={canHideMessages}
                          />
                        ) : null}
                      </div>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => {
                  // if ((cell.row.original as any).isBranch)
                  //   return ( <></> );
                  return (
                    <TableCell
                      className="py-2"
                      key={cell.id}
                      rowSpan={getRowSpanForCell(cell)}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function Filter<TData, TValue>({
  column,
  impressionsThreshold,
  canHideMessages,
}: {
  column: Column<TData, TValue>;
  impressionsThreshold?: string;
  canHideMessages?: boolean;
}) {
  const { filterVariant } = column.columnDef.meta ?? {};
  const [hideMessages, setHideMessages] = useState(false);

  if (filterVariant === "text") {
    return (
      <div>
        <input
          type="text"
          value={(column.getFilterValue() ?? "") as string}
          onChange={(e) => column.setFilterValue(e.target.value)}
          placeholder={`Search...`}
          className="w-full border border-slate-400 font-medium p-1 text-2xs rounded text-primary placeholder:font-light"
        />
      </div>
    );
  } else if (filterVariant === "checkbox" && canHideMessages) {
    return (
      <HideMessageCheckbox
        column={column}
        hideMessages={hideMessages}
        setHideMessages={setHideMessages}
        impressionsThreshold={impressionsThreshold}
      />
    );
  } else {
    return <></>;
  }
}
