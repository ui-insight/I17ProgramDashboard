export type EducationalObjective =
  | "Associate"
  | "Bachelor"
  | "Certificate"
  | "Diploma"
  | "Doctorate"
  | "Graduate Cert"
  | "Masters"
  | "Academy"
  | "Apprenticeship"
  | "OJT"
  | "Journeyman"
  | "Vocational"
  | "Other";

export type ApprovalStatus =
  | "New Approved"
  | "Still Approved"
  | "No Longer Offered"
  | "Name Change"
  | "Withdrawn"
  | "Teach Out Phase"
  | "Deemed Approved";

export type ProgramLengthMeasurement =
  | "Semester"
  | "Quarter"
  | "Clock"
  | "Months"
  | "Years";

export type Modality = "Resident" | "Distance" | "Hybrid" | "Both";

export interface Program {
  id: string;
  row_number: number | null;
  program_name: string;
  is_accredited: boolean;
  educational_objective: EducationalObjective;
  has_concentrations: boolean;
  approval_status: ApprovalStatus;
  effective_date: string | null;
  date_instruction_began: string | null;
  total_credit_hours: number | null;
  program_length_measurement: ProgramLengthMeasurement;
  full_time_enrollment_hours: number;
  lab_classes_info: string | null;
  instructional_sites: string | null;
  additional_fees: string | null;
  catalog_page: string;
  is_license_cert_prep: boolean;
  modality: Modality;
  is_contracted: boolean;
  admission_standards: string | null;
  employment_cpt_required: boolean | null;
  degree_plan_url: string | null;
  comments: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProgramListResponse {
  items: Program[];
  total: number;
  page: number;
  page_size: number;
}

export interface ProgramFilters {
  search?: string;
  approval_status?: ApprovalStatus;
  educational_objective?: EducationalObjective;
  modality?: Modality;
  is_accredited?: boolean;
  page?: number;
  page_size?: number;
}

export type ProgramCreate = Omit<Program, "id" | "created_at" | "updated_at">;
export type ProgramUpdate = Partial<ProgramCreate>;
