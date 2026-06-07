"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { SlidersHorizontal, X, Search } from "lucide-react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
                                             columns,
                                             data,
                                         }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = React.useState("")

    const globalFilterFn = React.useCallback(
        (row: any, _columnId: string, filterValue: string) => {
            const q = String(filterValue).trim().toLowerCase()
            if (!q) return true
            const title = String(row.original.title ?? "").toLowerCase()
            const model = String(row.original.model_number ?? "").toLowerCase()
            return title.includes(q) || model.includes(q)
        },
        [],
    )

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn,
        state: { sorting, columnFilters, globalFilter },
        initialState: { pagination: { pageSize: 15 } },
    })

    const toggleFilter = (columnId: string, value: string, checked: boolean) => {
        const col = table.getColumn(columnId)
        if (!col) return

        const current = (col.getFilterValue() as string[]) || []

        if (checked) {
            col.setFilterValue([...current, value])
        } else {
            const next = current.filter((v) => v !== value)
            col.setFilterValue(next.length > 0 ? next : undefined)
        }
    }

    const isChecked = (columnId: string, value: string) => {
        return (
            (table.getColumn(columnId)?.getFilterValue() as string[]) || []
        ).includes(value)
    }

    const getFilterCount = (columnId: string) => {
        const val = table.getColumn(columnId)?.getFilterValue() as string[] | undefined
        return val?.length || 0
    }

    const uniqueValues = (key: string) => {
        const set = new Set<string>()
        data.forEach((item: any) => item[key] && set.add(item[key]))
        return Array.from(set).sort()
    }

    const activeFilterCount = columnFilters.reduce(
        (acc, f) => acc + (Array.isArray(f.value) ? (f.value as string[]).length : 1),
        0
    )

    return (
        <div className="space-y-3">
            
            <div className="flex items-center gap-2 flex-wrap">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="جستجوی نام یا کد فنی..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="pr-9 bg-card"
                    />
                </div>

                {(["category", "brand"] as const).map((key) => {
                    const count = getFilterCount(key)
                    return (
                        <DropdownMenu key={key}>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={`border-dashed text-xs gap-1 ${
                                        count > 0 ? "border-primary/40 bg-primary/10 text-primary" : ""
                                    }`}
                                >
                                    <SlidersHorizontal className="h-3.5 w-3.5" />
                                    {key === "category" ? "دسته‌بندی" : "برند"}
                                    {count > 0 && (
                                        <span className="mr-1 rounded-full bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 leading-none">
                                            {count}
                                        </span>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 max-h-64 overflow-auto">
                                {uniqueValues(key).map((val) => (
                                    <DropdownMenuCheckboxItem
                                        key={val}
                                        checked={isChecked(key, val)}
                                        onCheckedChange={(checked) =>
                                            toggleFilter(key, val, checked)
                                        }
                                    >
                                        {val}
                                    </DropdownMenuCheckboxItem>
                                ))}
                                {count > 0 && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onSelect={() =>
                                                table.getColumn(key)?.setFilterValue(undefined)
                                            }
                                            className="justify-center text-xs text-destructive"
                                        >
                                            پاک کردن فیلتر
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )
                })}

                {activeFilterCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => table.resetColumnFilters()}
                        className="text-xs gap-1 text-destructive hover:text-destructive"
                    >
                        <X className="h-3.5 w-3.5" /> پاک کردن همه فیلترها
                    </Button>
                )}
            </div>

            
            <div className="rounded-xl border border-border bg-card overflow-hidden">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((hg) => (
                            <TableRow key={hg.id} className="bg-muted/50 hover:bg-muted/50 border-border">
                                {hg.headers.map((h) => (
                                    <TableHead
                                        key={h.id}
                                        className="text-xs font-semibold text-muted-foreground"
                                    >
                                        {h.isPlaceholder
                                            ? null
                                            : flexRender(
                                                h.column.columnDef.header,
                                                h.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="hover:bg-accent/50 border-border">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="text-sm">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    محصولی یافت نشد
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            
            <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                    {table.getFilteredRowModel().rows.length} محصول
                    {activeFilterCount > 0 && ` (فیلتر شده از ${data.length})`}
                </span>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                        صفحه {table.getState().pagination.pageIndex + 1} از{" "}
                        {table.getPageCount()}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        قبلی
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        بعدی
                    </Button>
                </div>
            </div>
        </div>
    )
}