import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createProgram,
  deleteProgram,
  getProgram,
  updateProgram,
} from "../api/programs";
import type { Program, ProgramCreate } from "../types/program";

const OBJECTIVES = [
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
] as const;

const STATUSES = [
  "New Approved",
  "Still Approved",
  "No Longer Offered",
  "Name Change",
  "Withdrawn",
  "Teach Out Phase",
  "Deemed Approved",
] as const;

const MEASUREMENTS = ["Semester", "Quarter", "Clock", "Months", "Years"] as const;
const MODALITIES = ["Resident", "Distance", "Hybrid", "Both"] as const;

const EMPTY_FORM: ProgramCreate = {
  row_number: null,
  program_name: "",
  is_accredited: true,
  educational_objective: "Bachelor",
  has_concentrations: false,
  approval_status: "Still Approved",
  effective_date: null,
  date_instruction_began: null,
  total_credit_hours: null,
  program_length_measurement: "Semester",
  full_time_enrollment_hours: 12,
  lab_classes_info: null,
  instructional_sites: null,
  additional_fees: null,
  catalog_page: "",
  is_license_cert_prep: false,
  modality: "Both",
  is_contracted: false,
  admission_standards: null,
  employment_cpt_required: null,
  degree_plan_url: null,
  comments: null,
};

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function CheckField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-gray-300"
      />
      {label}
    </label>
  );
}

export default function ProgramDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === "new";

  const [form, setForm] = useState<ProgramCreate>(EMPTY_FORM);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProgram = useCallback(async () => {
    if (isNew || !id) return;
    setLoading(true);
    try {
      const program = await getProgram(id);
      setForm(programToForm(program));
    } catch {
      setError("Program not found");
    } finally {
      setLoading(false);
    }
  }, [id, isNew]);

  useEffect(() => {
    loadProgram();
  }, [loadProgram]);

  function programToForm(p: Program): ProgramCreate {
    return { ...p };
  }

  function update<K extends keyof ProgramCreate>(
    field: K,
    value: ProgramCreate[K]
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    if (!form.program_name.trim()) {
      setError("Program name is required");
      return;
    }
    if (!form.catalog_page.trim()) {
      setError("Catalog page is required");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      if (isNew) {
        await createProgram(form);
      } else {
        await updateProgram(id!, form);
      }
      navigate("/programs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this program?")) return;
    try {
      await deleteProgram(id!);
      navigate("/programs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate("/programs")}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              &larr; Back to Programs
            </button>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">
              {isNew ? "Add Program" : "Edit Program"}
            </h1>
          </div>
          <div className="flex gap-2">
            {!isNew && (
              <button
                onClick={handleDelete}
                className="rounded-md bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
              >
                Delete
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Program Name *
              </label>
              <input
                type="text"
                value={form.program_name}
                onChange={(e) => update("program_name", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <SelectField
              label="Educational Objective"
              value={form.educational_objective}
              options={OBJECTIVES}
              onChange={(v) => update("educational_objective", v as typeof form.educational_objective)}
            />

            <SelectField
              label="Approval Status"
              value={form.approval_status}
              options={STATUSES}
              onChange={(v) => update("approval_status", v as typeof form.approval_status)}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Effective Date
              </label>
              <input
                type="date"
                value={form.effective_date || ""}
                onChange={(e) =>
                  update("effective_date", e.target.value || null)
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Credit Hours
              </label>
              <input
                type="number"
                value={form.total_credit_hours ?? ""}
                onChange={(e) =>
                  update(
                    "total_credit_hours",
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <SelectField
              label="Program Length Measurement"
              value={form.program_length_measurement}
              options={MEASUREMENTS}
              onChange={(v) =>
                update(
                  "program_length_measurement",
                  v as typeof form.program_length_measurement
                )
              }
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full-Time Enrollment Hours
              </label>
              <input
                type="number"
                value={form.full_time_enrollment_hours}
                onChange={(e) =>
                  update("full_time_enrollment_hours", Number(e.target.value) || 0)
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <SelectField
              label="Modality"
              value={form.modality}
              options={MODALITIES}
              onChange={(v) => update("modality", v as typeof form.modality)}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catalog Page *
              </label>
              <input
                type="text"
                value={form.catalog_page}
                onChange={(e) => update("catalog_page", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="border-t pt-4 flex flex-wrap gap-x-8 gap-y-3">
            <CheckField
              label="Accredited"
              checked={form.is_accredited}
              onChange={(v) => update("is_accredited", v)}
            />
            <CheckField
              label="Has Concentrations"
              checked={form.has_concentrations}
              onChange={(v) => update("has_concentrations", v)}
            />
            <CheckField
              label="License/Cert Prep"
              checked={form.is_license_cert_prep}
              onChange={(v) => update("is_license_cert_prep", v)}
            />
            <CheckField
              label="Contracted Program"
              checked={form.is_contracted}
              onChange={(v) => update("is_contracted", v)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comments
            </label>
            <textarea
              value={form.comments || ""}
              onChange={(e) => update("comments", e.target.value || null)}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
