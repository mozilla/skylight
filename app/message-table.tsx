"use client";

import { useState } from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
  ExpandedState,
  ColumnFiltersState,
  getFilteredRowModel,
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

interface MessageTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  defaultExpanded?: boolean;
  canHideMessages?: boolean;
}

export function MessageTable<TData, TValue>({
  columns,
  data,
  defaultExpanded,
  canHideMessages,
}: MessageTableProps<TData, TValue>) {
  // Tables will start collapsed if defaultExpanded is undefined
  const [expanded, setExpanded] = useState<ExpandedState>(
    defaultExpanded || {},
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSubRows: (originalRow: any) => originalRow.branches,
    getExpandedRowModel: getExpandedRowModel(),
  });

  function getRowSpanForCell(cell: any) {
    // XXX is an experiment & the dates column
    // if (cell.row.original.recipe && cell.column.id == 'dates') {
    //   return cell.row.original.recipe.branches.length
    // }

    return 1;
  }

  const [hideMessages, setHideMessages] = useState(false);

  return (
    <div>
      {canHideMessages && (
        <div className="flex items-center gap-x-1 m-2">
          <Checkbox
            id="hide"
            checked={hideMessages}
            onCheckedChange={() => setHideMessages(!hideMessages)}
          />
          <label
            htmlFor="hide"
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Hide messages with fewer than 1000 impressions
          </label>
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader className="sticky top-36">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className="bg-stone-100 text-slate-400"
                      key={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
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
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
