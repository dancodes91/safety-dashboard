'use client';

import { useState, useEffect } from 'react';
import { FiChevronDown, FiChevronUp, FiChevronLeft, FiChevronRight, FiSearch, FiFilter, FiDownload } from 'react-icons/fi';

interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (info: { row: T }) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  perPageOptions?: number[];
  defaultPerPage?: number;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  showSearch?: boolean;
  showDownload?: boolean;
  onDownload?: () => void;
  downloadFileName?: string;
  className?: string;
  rowClassName?: string | ((row: T) => string);
}

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  title = '',
  perPageOptions = [10, 25, 50, 100],
  defaultPerPage = 10,
  onRowClick,
  isLoading = false,
  emptyMessage = 'No data available',
  showSearch = true,
  showDownload = false,
  onDownload,
  downloadFileName,
  className = '',
  rowClassName = ''
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(defaultPerPage);
  const [filteredData, setFilteredData] = useState<T[]>(data);
  const [visibleData, setVisibleData] = useState<T[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  // Handle data sorting and filtering
  useEffect(() => {
    let result = [...data];

    // Apply search filter if term exists
    if (searchTerm.trim() !== '') {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      result = result.filter(row => {
        return Object.keys(row).some(key => {
          const value = row[key];
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(lowerCaseSearchTerm);
        });
      });
    }

    // Apply sorting if column is selected
    if (sortColumn) {
      result.sort((a, b) => {
        const valueA = getNestedValue(a, sortColumn);
        const valueB = getNestedValue(b, sortColumn);

        if (valueA === valueB) return 0;
        
        // Handle different types of values
        const directionModifier = sortDirection === 'asc' ? 1 : -1;
        
        if (valueA === null || valueA === undefined) return 1 * directionModifier;
        if (valueB === null || valueB === undefined) return -1 * directionModifier;
        
        if (typeof valueA === 'string') {
          return valueA.localeCompare(String(valueB)) * directionModifier;
        }
        
        return (valueA > valueB ? 1 : -1) * directionModifier;
      });
    }

    setFilteredData(result);
    setTotalPages(Math.ceil(result.length / perPage) || 1);
    setCurrentPage(prev => Math.min(prev, Math.ceil(result.length / perPage) || 1));
  }, [data, searchTerm, sortColumn, sortDirection, perPage]);

  // Paginate the data
  useEffect(() => {
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    setVisibleData(filteredData.slice(start, end));
  }, [filteredData, currentPage, perPage]);

  // Get nested object values using path notation (e.g., "user.name")
  const getNestedValue = (obj: any, path: string): any => {
    const keys = path.split('.');
    return keys.reduce((o, key) => (o && o[key] !== undefined ? o[key] : null), obj);
  };

  const renderCell = (row: T, column: Column<T>) => {
    if (column.cell) {
      return column.cell({ row });
    }
    
    const value = getNestedValue(row, column.accessorKey as string);
    return value !== null && value !== undefined ? String(value) : '';
  };

  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;
    
    const columnKey = column.accessorKey as string;
    
    if (sortColumn === columnKey) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
      return;
    }
    
    // Default CSV export
    const headers = columns.map(col => col.header).join(',');
    const rows = filteredData.map(row => {
      return columns.map(col => {
        const value = getNestedValue(row, col.accessorKey as string);
        if (value === null || value === undefined) return '';
        
        // Handle commas in data by wrapping in quotes
        const strValue = String(value);
        return strValue.includes(',') ? `"${strValue}"` : strValue;
      }).join(',');
    }).join('\n');
    
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${downloadFileName || 'export'}.csv`);
    link.click();
  };

  const getRowClassName = (row: T) => {
    if (typeof rowClassName === 'function') {
      return rowClassName(row);
    }
    return rowClassName;
  };

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {/* Header with title, search and download */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          {title && <h3 className="text-lg font-medium">{title}</h3>}
          
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {showSearch && (
              <div className="relative flex-grow max-w-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            )}
            
            {showDownload && (
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={handleDownload}
              >
                <FiDownload className="mr-2 -ml-0.5" />
                Export
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.sortable ? 'cursor-pointer select-none' : ''}`}
                  onClick={() => column.sortable && handleSort(column)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.sortable && sortColumn === column.accessorKey && (
                      <span className="inline-flex">
                        {sortDirection === 'asc' ? <FiChevronUp /> : <FiChevronDown />}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : visibleData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              visibleData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''} ${getRowClassName(row)}`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {renderCell(row, column)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="px-4 py-3 border-t border-gray-200 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <span className="text-sm text-gray-700 mr-2">
              Rows per page:
            </span>
            <select
              className="border border-gray-300 rounded-md text-sm p-1"
              value={perPage}
              onChange={e => setPerPage(Number(e.target.value))}
            >
              {perPageOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span className="ml-4 text-sm text-gray-700">
              {filteredData.length} total rows
            </span>
          </div>
          
          <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-2">
              Page {currentPage} of {totalPages}
            </span>
            <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                type="button"
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Previous</span>
                <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <span className="sr-only">Next</span>
                <FiChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}