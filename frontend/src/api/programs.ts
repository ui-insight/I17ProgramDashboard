import { api } from "./client";
import type {
  Program,
  ProgramCreate,
  ProgramFilters,
  ProgramListResponse,
  ProgramUpdate,
} from "../types/program";

export async function listPrograms(
  filters: ProgramFilters = {}
): Promise<ProgramListResponse> {
  const params: Record<string, string> = {};
  if (filters.search) params.search = filters.search;
  if (filters.approval_status) params.approval_status = filters.approval_status;
  if (filters.educational_objective)
    params.educational_objective = filters.educational_objective;
  if (filters.modality) params.modality = filters.modality;
  if (filters.is_accredited !== undefined)
    params.is_accredited = String(filters.is_accredited);
  if (filters.page) params.page = String(filters.page);
  if (filters.page_size) params.page_size = String(filters.page_size);
  return api.get<ProgramListResponse>("/programs/", params);
}

export async function getProgram(id: string): Promise<Program> {
  return api.get<Program>(`/programs/${id}`);
}

export async function createProgram(data: ProgramCreate): Promise<Program> {
  return api.post<Program>("/programs/", data);
}

export async function updateProgram(
  id: string,
  data: ProgramUpdate
): Promise<Program> {
  return api.put<Program>(`/programs/${id}`, data);
}

export async function deleteProgram(id: string): Promise<void> {
  return api.delete<void>(`/programs/${id}`);
}
