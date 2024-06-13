"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
  ExpandedState
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { BranchInfo } from "./columns.tsx"
import { useState } from "react"

interface MessageTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  defaultExpanded?: boolean
}

export function MessageTable<TData, TValue>({
  columns,
  data,
  defaultExpanded
}: MessageTableProps<TData, TValue>) {
  // Tables will start collapsed if defaultExpanded is undefined
  const [expanded, setExpanded] = useState<ExpandedState>(defaultExpanded || {})
  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getSubRows: (originalRow: any) => originalRow.branches,
    getExpandedRowModel: getExpandedRowModel(),
  })

  function getRowSpanForCell(cell : any) {
    // XXX is an experiment & the dates column
    // if (cell.row.original.recipe && cell.column.id == 'dates') {
    //   return cell.row.original.recipe.branches.length
    // }

    return 1;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead className="bg-stone-100 text-slate-400" key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
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
                      <TableCell className="py-2" key={cell.id} rowSpan=
                        {getRowSpanForCell(cell)}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
  )
}
