import { useNavigate } from "react-router-dom";
import type { Program } from "../types/program";

const STATUS_COLORS: Record<string, string> = {
  "Still Approved": "bg-green-100 text-green-800",
  "New Approved": "bg-blue-100 text-blue-800",
  "Teach Out Phase": "bg-yellow-100 text-yellow-800",
  "No Longer Offered": "bg-gray-100 text-gray-800",
  Withdrawn: "bg-red-100 text-red-800",
  "Name Change": "bg-purple-100 text-purple-800",
  "Deemed Approved": "bg-green-100 text-green-800",
};

interface Props {
  programs: Program[];
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
}

function SortHeader({
  label,
  field,
  current,
  direction,
  onSort,
}: {
  label: string;
  field: string;
  current: string;
  direction: "asc" | "desc";
  onSort: (field: string) => void;
}) {
  const isActive = current === field;
  return (
    <th
      onClick={() => onSort(field)}
      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
    >
      {label}
      {isActive && (
        <span className="ml-1">{direction === "asc" ? "\u2191" : "\u2193"}</span>
      )}
    </th>
  );
}

export default function ProgramTable({
  programs,
  sortField,
  sortDirection,
  onSort,
}: Props) {
  const navigate = useNavigate();

  if (programs.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No programs found matching your criteria.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <SortHeader
              label="Program Name"
              field="program_name"
              current={sortField}
              direction={sortDirection}
              onSort={onSort}
            />
            <SortHeader
              label="Objective"
              field="educational_objective"
              current={sortField}
              direction={sortDirection}
              onSort={onSort}
            />
            <SortHeader
              label="Status"
              field="approval_status"
              current={sortField}
              direction={sortDirection}
              onSort={onSort}
            />
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Credits
            </th>
            <SortHeader
              label="Modality"
              field="modality"
              current={sortField}
              direction={sortDirection}
              onSort={onSort}
            />
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Accredited
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {programs.map((p) => (
            <tr
              key={p.id}
              onClick={() => navigate(`/programs/${p.id}`)}
              className="hover:bg-gray-50 cursor-pointer"
            >
              <td className="px-4 py-3 text-sm font-medium text-gray-900 max-w-md truncate">
                {p.program_name}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {p.educational_objective}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${STATUS_COLORS[p.approval_status] || "bg-gray-100 text-gray-800"}`}
                >
                  {p.approval_status}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {p.total_credit_hours ?? "-"}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{p.modality}</td>
              <td className="px-4 py-3 text-sm">
                {p.is_accredited ? (
                  <span className="text-green-600">Yes</span>
                ) : (
                  <span className="text-gray-400">No</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
