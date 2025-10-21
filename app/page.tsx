"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import data from "../public/data.json";

type Product = {
  id: string;
  name: string;
  category: string;
  sizeRange: string;
  gender: string;
};

type DataStructure = {
  version: {
    [key: string]: Product[];
  };
};

export default function Home() {
  const [selectedVersion, setSelectedVersion] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "id", desc: false },
  ]);
  const [nameFilter, setNameFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [sizeRangeFilter, setSizeRangeFilter] = useState<string[]>([]);
  const [genderFilter, setGenderFilter] = useState<string[]>([]);

  const typedData = data as DataStructure;
  const versions = Object.keys(typedData.version);

  // Set initial version if not set
  if (!selectedVersion && versions.length > 0) {
    setSelectedVersion(versions[0]);
  }

  const products = useMemo(() => {
    return selectedVersion ? typedData.version[selectedVersion] || [] : [];
  }, [selectedVersion, typedData.version]);

  // Get unique values for filters
  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category))).sort();
  }, [products]);

  const uniqueSizeRanges = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.sizeRange))).sort();
  }, [products]);

  const uniqueGenders = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.gender))).sort();
  }, [products]);

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => info.getValue(),
      filterFn: (row, columnId, filterValue) => {
        const value = row.getValue(columnId) as string;
        return value.toLowerCase().includes(filterValue.toLowerCase());
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: (info) => info.getValue(),
      filterFn: (row, columnId, filterValue: string[]) => {
        if (filterValue.length === 0) return true;
        const value = row.getValue(columnId) as string;
        return filterValue.includes(value);
      },
    },
    {
      accessorKey: "sizeRange",
      header: "Size Range",
      cell: (info) => info.getValue(),
      filterFn: (row, columnId, filterValue: string[]) => {
        if (filterValue.length === 0) return true;
        const value = row.getValue(columnId) as string;
        return filterValue.includes(value);
      },
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: (info) => info.getValue(),
      filterFn: (row, columnId, filterValue: string[]) => {
        if (filterValue.length === 0) return true;
        const value = row.getValue(columnId) as string;
        return filterValue.includes(value);
      },
    },
  ];

  // Apply filters
  const filteredData = useMemo(() => {
    let result = [...products];

    // Name filter
    if (nameFilter) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter.length > 0) {
      result = result.filter((p) => categoryFilter.includes(p.category));
    }

    // Size range filter
    if (sizeRangeFilter.length > 0) {
      result = result.filter((p) => sizeRangeFilter.includes(p.sizeRange));
    }

    // Gender filter
    if (genderFilter.length > 0) {
      result = result.filter((p) => genderFilter.includes(p.gender));
    }

    return result;
  }, [products, nameFilter, categoryFilter, sizeRangeFilter, genderFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleDownload = (format: "csv" | "xlsx") => {
    // For now, download data.json as specified
    const blob = new Blob([JSON.stringify(typedData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `data.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCheckboxChange = (
    value: string,
    currentFilters: string[],
    setFilter: (filters: string[]) => void
  ) => {
    if (currentFilters.includes(value)) {
      setFilter(currentFilters.filter((v) => v !== value));
    } else {
      setFilter([...currentFilters, value]);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <main className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          ASSORT Standard Products
        </h1>

        {/* Version Selector */}
        <div className="flex justify-end mb-4">
          <select
            value={selectedVersion}
            onChange={(e) => setSelectedVersion(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white"
          >
            <option value="" disabled>
              Select version
            </option>
            {versions.map((version) => (
              <option key={version} value={version}>
                {version}
              </option>
            ))}
          </select>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          {/* Name Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Filter by Name:
            </label>
            <input
              type="text"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              placeholder="Search by name..."
              className="px-4 py-2 border border-gray-300 rounded-md w-full max-w-md"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Filter by Category:
            </label>
            <div className="flex flex-wrap gap-4">
              {uniqueCategories.map((category) => (
                <label key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={categoryFilter.includes(category)}
                    onChange={() =>
                      handleCheckboxChange(
                        category,
                        categoryFilter,
                        setCategoryFilter
                      )
                    }
                    className="mr-2"
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>

          {/* Size Range Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Filter by Size Range:
            </label>
            <div className="flex flex-wrap gap-4">
              {uniqueSizeRanges.map((sizeRange) => (
                <label key={sizeRange} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={sizeRangeFilter.includes(sizeRange)}
                    onChange={() =>
                      handleCheckboxChange(
                        sizeRange,
                        sizeRangeFilter,
                        setSizeRangeFilter
                      )
                    }
                    className="mr-2"
                  />
                  {sizeRange}
                </label>
              ))}
            </div>
          </div>

          {/* Gender Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Filter by Gender:
            </label>
            <div className="flex flex-wrap gap-4">
              {uniqueGenders.map((gender) => (
                <label key={gender} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={genderFilter.includes(gender)}
                    onChange={() =>
                      handleCheckboxChange(gender, genderFilter, setGenderFilter)
                    }
                    className="mr-2"
                  />
                  {gender}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mx-auto max-w-5xl">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-gray-100">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="border border-gray-300 px-4 py-2 text-left"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort()
                              ? "cursor-pointer select-none flex items-center gap-2"
                              : ""
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="border border-gray-300 px-4 py-8 text-center text-gray-500"
                  >
                    No products found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="border border-gray-300 px-4 py-2"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Download Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => handleDownload("xlsx")}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Download as .xlsx
          </button>
          <button
            onClick={() => handleDownload("csv")}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Download as .csv
          </button>
        </div>
      </main>
    </div>
  );
}
