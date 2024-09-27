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

interface HideMessageCheckboxProps {
  header: any;
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

function HideMessageCheckbox({
  header,
  hideMessages,
  setHideMessages,
  impressionsThreshold,
}: HideMessageCheckboxProps) {
  return (
    <div className="flex items-center gap-x-1">
      <Checkbox
        className="border-slate-400"
        id="hide"
        onCheckedChange={() => {
          if (!hideMessages) {
            header.column.setFilterValue(parseInt(impressionsThreshold!));
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

  const [hideMessages, setHideMessages] = useState(false);

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
                    className="bg-stone-100 text-slate-400 py-2"
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
                            .includes("Metrics") && (
                            <HideMessageCheckbox
                              header={header}
                              hideMessages={hideMessages}
                              setHideMessages={setHideMessages}
                              impressionsThreshold={impressionsThreshold}
                            />
                          )}
                        {header.column.columnDef
                          .header!.toString()
                          .includes("Surface") && (
                          <div>
                            <input
                              type="text"
                              value={
                                (header.column.getFilterValue() ?? "") as string
                              }
                              onChange={(e) =>
                                header.column.setFilterValue(e.target.value)
                              }
                              placeholder={`Search...`}
                              className="w-full border border-slate-400 font-light px-1 text-2xs rounded"
                            />
                          </div>
                        )}
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
