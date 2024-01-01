"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Message = {
  product: 'Desktop' | 'Android'
  release: string
  displayName: string
  id: string
  topic: string
  surface: string
  segment: string
  ctrPercent: string
  ctrPercentChange: string
  ctrDashboard: string
  previewLink: string
}

export const columns: ColumnDef<Message>[] = [
  {
    accessorKey: "release",
    header: "Release",
  },
  {
    accessorKey: "id",
    header: "Message ID",
  },
  {
    accessorKey: "topic",
    header: "Topic",
  },
  {
    accessorKey: "surface",
    header: "Surface",
  },{
    accessorKey: "segment",
    header: "Segment",
  },{
    accessorKey: "Metrics",
    header: "Metrics",
  },{
    accessorKey: "references",
    header: "References",
  },
]
