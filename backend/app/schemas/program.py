"""Pydantic schemas for Program resource."""

from datetime import date, datetime

from pydantic import BaseModel, ConfigDict

from app.models.program import (
    ApprovalStatus,
    EducationalObjective,
    Modality,
    ProgramLengthMeasurement,
)


class ProgramCreate(BaseModel):
    program_name: str
    is_accredited: bool
    educational_objective: EducationalObjective
    has_concentrations: bool
    approval_status: ApprovalStatus
    effective_date: date | None = None
    date_instruction_began: date | None = None
    total_credit_hours: int | None = None
    program_length_measurement: ProgramLengthMeasurement
    full_time_enrollment_hours: int
    lab_classes_info: str | None = None
    instructional_sites: str | None = None
    additional_fees: str | None = None
    catalog_page: str
    is_license_cert_prep: bool
    modality: Modality
    is_contracted: bool
    admission_standards: str | None = None
    employment_cpt_required: bool | None = None
    degree_plan_url: str | None = None
    comments: str | None = None
    row_number: int | None = None


class ProgramUpdate(BaseModel):
    program_name: str | None = None
    is_accredited: bool | None = None
    educational_objective: EducationalObjective | None = None
    has_concentrations: bool | None = None
    approval_status: ApprovalStatus | None = None
    effective_date: date | None = None
    date_instruction_began: date | None = None
    total_credit_hours: int | None = None
    program_length_measurement: ProgramLengthMeasurement | None = None
    full_time_enrollment_hours: int | None = None
    lab_classes_info: str | None = None
    instructional_sites: str | None = None
    additional_fees: str | None = None
    catalog_page: str | None = None
    is_license_cert_prep: bool | None = None
    modality: Modality | None = None
    is_contracted: bool | None = None
    admission_standards: str | None = None
    employment_cpt_required: bool | None = None
    degree_plan_url: str | None = None
    comments: str | None = None
    row_number: int | None = None


class ProgramResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    row_number: int | None
    program_name: str
    is_accredited: bool
    educational_objective: EducationalObjective
    has_concentrations: bool
    approval_status: ApprovalStatus
    effective_date: date | None
    date_instruction_began: date | None
    total_credit_hours: int | None
    program_length_measurement: ProgramLengthMeasurement
    full_time_enrollment_hours: int
    lab_classes_info: str | None
    instructional_sites: str | None
    additional_fees: str | None
    catalog_page: str
    is_license_cert_prep: bool
    modality: Modality
    is_contracted: bool
    admission_standards: str | None
    employment_cpt_required: bool | None
    degree_plan_url: str | None
    comments: str | None
    created_at: datetime
    updated_at: datetime


class ProgramListResponse(BaseModel):
    items: list[ProgramResponse]
    total: int
    page: int
    page_size: int
