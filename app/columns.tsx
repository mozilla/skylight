"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Experiment = {
  slug: string
  displayName: string
  topic: string
  surface: string
  segment: string
  metrics: string
}

export const columns: ColumnDef<Experiment>[] = [
  {
    accessorKey: "displayName",
    header: "Name",
  },
  {
    accessorKey: "metrics",
    header: "Metrics",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
]
