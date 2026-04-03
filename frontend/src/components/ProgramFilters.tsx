import type {
  ApprovalStatus,
  EducationalObjective,
  Modality,
  ProgramFilters as Filters,
} from "../types/program";

const APPROVAL_STATUSES: ApprovalStatus[] = [
  "New Approved",
  "Still Approved",
  "No Longer Offered",
  "Name Change",
  "Withdrawn",
  "Teach Out Phase",
  "Deemed Approved",
];

const EDUCATIONAL_OBJECTIVES: EducationalObjective[] = [
  "Associate",
  "Bachelor",
  "Certificate",
  "Diploma",
  "Doctorate",
  "Graduate Cert",
  "Masters",
  "Academy",
  "Apprenticeship",
  "OJT",
  "Journeyman",
  "Vocational",
  "Other",
];

const MODALITIES: Modality[] = ["Resident", "Distance", "Hybrid", "Both"];

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export default function ProgramFilters({ filters, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Search
        </label>
        <input
          type="text"
          placeholder="Search program name..."
          value={filters.search || ""}
          onChange={(e) =>
            onChange({ ...filters, search: e.target.value || undefined, page: 1 })
          }
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          value={filters.approval_status || ""}
          onChange={(e) =>
            onChange({
              ...filters,
              approval_status: (e.target.value as ApprovalStatus) || undefined,
              page: 1,
            })
          }
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">All Statuses</option>
          {APPROVAL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Objective
        </label>
        <select
          value={filters.educational_objective || ""}
          onChange={(e) =>
            onChange({
              ...filters,
              educational_objective:
                (e.target.value as EducationalObjective) || undefined,
              page: 1,
            })
          }
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">All Objectives</option>
          {EDUCATIONAL_OBJECTIVES.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Modality
        </label>
        <select
          value={filters.modality || ""}
          onChange={(e) =>
            onChange({
              ...filters,
              modality: (e.target.value as Modality) || undefined,
              page: 1,
            })
          }
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">All Modalities</option>
          {MODALITIES.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {(filters.search ||
        filters.approval_status ||
        filters.educational_objective ||
        filters.modality) && (
        <button
          onClick={() => onChange({ page: 1 })}
          className="rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-600 hover:bg-gray-200"
        >
          Clear
        </button>
      )}
    </div>
  );
}
