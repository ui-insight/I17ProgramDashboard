"""Program model for I-17 recertification tracking."""

import enum
import uuid
from datetime import date, datetime

from sqlalchemy import Boolean, Date, DateTime, Enum, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class EducationalObjective(enum.StrEnum):
    ASSOCIATE = "Associate"
    BACHELOR = "Bachelor"
    CERTIFICATE = "Certificate"
    DIPLOMA = "Diploma"
    DOCTORATE = "Doctorate"
    GRADUATE_CERT = "Graduate Cert"
    MASTERS = "Masters"
    ACADEMY = "Academy"
    APPRENTICESHIP = "Apprenticeship"
    OJT = "OJT"
    JOURNEYMAN = "Journeyman"
    VOCATIONAL = "Vocational"
    OTHER = "Other"


class ApprovalStatus(enum.StrEnum):
    NEW_APPROVED = "New Approved"
    STILL_APPROVED = "Still Approved"
    NO_LONGER_OFFERED = "No Longer Offered"
    NAME_CHANGE = "Name Change"
    WITHDRAWN = "Withdrawn"
    TEACH_OUT_PHASE = "Teach Out Phase"
    DEEMED_APPROVED = "Deemed Approved"


class ProgramLengthMeasurement(enum.StrEnum):
    SEMESTER = "Semester"
    QUARTER = "Quarter"
    CLOCK = "Clock"
    MONTHS = "Months"
    YEARS = "Years"


class Modality(enum.StrEnum):
    RESIDENT = "Resident"
    DISTANCE = "Distance"
    HYBRID = "Hybrid"
    BOTH = "Both"


class Program(Base):
    __tablename__ = "programs"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    row_number: Mapped[int | None] = mapped_column(Integer, nullable=True)
    program_name: Mapped[str] = mapped_column(String(500), nullable=False, index=True)
    is_accredited: Mapped[bool] = mapped_column(Boolean, nullable=False)
    educational_objective: Mapped[EducationalObjective] = mapped_column(
        Enum(EducationalObjective), nullable=False
    )
    has_concentrations: Mapped[bool] = mapped_column(Boolean, nullable=False)
    approval_status: Mapped[ApprovalStatus] = mapped_column(
        Enum(ApprovalStatus), nullable=False
    )
    effective_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    date_instruction_began: Mapped[date | None] = mapped_column(Date, nullable=True)
    total_credit_hours: Mapped[int | None] = mapped_column(Integer, nullable=True)
    program_length_measurement: Mapped[ProgramLengthMeasurement] = mapped_column(
        Enum(ProgramLengthMeasurement), nullable=False
    )
    full_time_enrollment_hours: Mapped[int] = mapped_column(Integer, nullable=False)
    lab_classes_info: Mapped[str | None] = mapped_column(Text, nullable=True)
    instructional_sites: Mapped[str | None] = mapped_column(String(500), nullable=True)
    additional_fees: Mapped[str | None] = mapped_column(Text, nullable=True)
    catalog_page: Mapped[str] = mapped_column(String(50), nullable=False)
    is_license_cert_prep: Mapped[bool] = mapped_column(Boolean, nullable=False)
    modality: Mapped[Modality] = mapped_column(Enum(Modality), nullable=False)
    is_contracted: Mapped[bool] = mapped_column(Boolean, nullable=False)
    admission_standards: Mapped[str | None] = mapped_column(Text, nullable=True)
    employment_cpt_required: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    degree_plan_url: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    comments: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )
