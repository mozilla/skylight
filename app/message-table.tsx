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
  impressionsThreshold?: string;
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
  });

  const [hideMessages, setHideMessages] = useState(false);

  function getRowSpanForCell(cell: any) {
    // XXX is an experiment & the dates column
    // if (cell.row.original.recipe && cell.column.id == 'dates') {
    //   return cell.row.original.recipe.branches.length
    // }

    return 1;
  }

  return (
    <div>
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
                      {header.isPlaceholder ? null : (
                        <div>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {canHideMessages &&
                          header.column.columnDef
                            .header!.toString()
                            .includes("Metrics") ? (
                            <div className="flex items-center gap-x-1">
                              <Checkbox
                                className="border-slate-500"
                                id="hide"
                                onCheckedChange={() => {
                                  if (!hideMessages) {
                                    header.column.setFilterValue(
                                      parseInt(impressionsThreshold!),
                                    );
                                  } else {
                                    header.column.setFilterValue(null);
                                  }
                                  setHideMessages(!hideMessages);
                                }}
                              />
                              <label
                                htmlFor="hide"
                                className="text-3xs font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Hide messages with fewer than{" "}
                                {impressionsThreshold} impressions
                              </label>
                            </div>
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
