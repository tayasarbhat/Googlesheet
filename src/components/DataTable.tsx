import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { Search, Filter } from 'lucide-react';
import type { SheetRow } from '../types';

const columnHelper = createColumnHelper<SheetRow>();

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-gradient-to-r from-green-400 to-emerald-400 text-transparent bg-clip-text';
    case 'pending':
      return 'bg-gradient-to-r from-yellow-400 to-amber-400 text-transparent bg-clip-text';
    case 'inactive':
      return 'bg-gradient-to-r from-red-400 to-rose-400 text-transparent bg-clip-text';
    default:
      return 'text-white';
  }
};

const columns = [
  'Assigned',
  'MSISDN',
  'Category',
  'Status',
  'In Process Date',
  'Activation Date',
  'Remove',
  '@dropdown',
].map((key) =>
  columnHelper.accessor(key as keyof SheetRow, {
    header: key,
    cell: (info) => {
      const value = info.getValue();
      if (key === 'Status') {
        return (
          <span className={`font-bold ${getStatusColor(value)}`}>
            {value}
          </span>
        );
      }
      return (
        <span className="font-medium hover:text-white transition-colors">
          {value}
        </span>
      );
    },
  })
);

export function DataTable({ data, isLoading, error }: DataTableProps) {
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [pageSize, setPageSize] = React.useState(10);
  const [columnFilters, setColumnFilters] = React.useState<any[]>([]);

  const uniqueCategories = React.useMemo(() => {
    const categories = new Set(data.map(row => row.Category));
    return ['all', ...Array.from(categories)];
  }, [data]);

  const handleCategoryChange = (value: string) => {
    if (value === 'all') {
      setColumnFilters([]);
    } else {
      setColumnFilters([
        {
          id: 'Category',
          value: value.toLowerCase(),
        },
      ]);
    }
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      pagination: {
        pageSize,
        pageIndex: 0,
      },
      columnFilters,
    },
    enableColumnFilters: true,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-purple-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-300">{error}</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 px-6">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            type="text"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search all columns..."
            className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg backdrop-blur-xl 
                     text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#FF0080]/50
                     transition-all duration-300"
          />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
            <select
              value={columnFilters[0]?.value || 'all'}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg backdrop-blur-xl 
                       text-white focus:outline-none focus:ring-2 focus:ring-[#FF0080]/50
                       transition-all duration-300"
            >
              {uniqueCategories.map((category) => (
                <option key={category} value={category.toLowerCase()} className="bg-gray-800">
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/90">Show</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="bg-white/10 border border-white/20 rounded-lg backdrop-blur-xl text-white px-3 py-2
                     focus:outline-none focus:ring-2 focus:ring-[#FF0080]/50 transition-all duration-300"
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size} className="bg-gray-800">
                {size}
              </option>
            ))}
            <option value={99999} className="bg-gray-800">All</option>
          </select>
          <span className="text-white/90">entries</span>
        </div>
      </div>

      <table className="min-w-full divide-y divide-white/10 border-separate border-spacing-0">
        <thead className="table-header-glass">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-5 text-left text-xs font-black text-white uppercase tracking-wider border-x border-white/10 first:border-l-0 last:border-r-0"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="table-glass divide-y divide-white/10">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-white/10 transition-all duration-200">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-6 py-4 whitespace-nowrap text-base border-x border-white/20 first:border-l-0 last:border-r-0"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="flex justify-between items-center mt-6 px-6 py-4 border-t border-white/20">
        <div className="text-white/90">
          Showing {table.getState().pagination.pageIndex * pageSize + 1} to{' '}
          {Math.min((table.getState().pagination.pageIndex + 1) * pageSize, table.getFilteredRowModel().rows.length)}{' '}
          of {table.getFilteredRowModel().rows.length} entries
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg backdrop-blur-xl text-white
                     disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-300"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg backdrop-blur-xl text-white
                     disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}