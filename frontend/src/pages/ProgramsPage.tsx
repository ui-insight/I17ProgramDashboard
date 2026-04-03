import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listPrograms } from "../api/programs";
import Pagination from "../components/Pagination";
import ProgramFilters from "../components/ProgramFilters";
import ProgramTable from "../components/ProgramTable";
import type { Program, ProgramFilters as Filters } from "../types/program";

export default function ProgramsPage() {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<Filters>({ page: 1, page_size: 50 });
  const [sortField, setSortField] = useState("program_name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listPrograms(filters);
      const items = [...data.items];
      items.sort((a, b) => {
        const aVal = (a as unknown as Record<string, unknown>)[sortField] ?? "";
        const bVal = (b as unknown as Record<string, unknown>)[sortField] ?? "";
        const cmp = String(aVal).localeCompare(String(bVal));
        return sortDirection === "asc" ? cmp : -cmp;
      });
      setPrograms(items);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load programs");
    } finally {
      setLoading(false);
    }
  }, [filters, sortField, sortDirection]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  function handleSort(field: string) {
    if (field === sortField) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              I-17 Program Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              SEVP Recertification Program Management
            </p>
          </div>
          <button
            onClick={() => navigate("/programs/new")}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Add Program
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <ProgramFilters filters={filters} onChange={setFilters} />
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 text-sm">{error}</div>
          )}

          {loading ? (
            <div className="p-12 text-center text-gray-500">
              Loading programs...
            </div>
          ) : (
            <>
              <ProgramTable
                programs={programs}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
              <Pagination
                page={filters.page || 1}
                pageSize={filters.page_size || 50}
                total={total}
                onPageChange={(p) => setFilters({ ...filters, page: p })}
              />
            </>
          )}
        </div>

        <div className="mt-4 text-center text-sm text-gray-400">
          {total} total programs | University of Idaho | Facility Code: 11901012
        </div>
      </main>
    </div>
  );
}
