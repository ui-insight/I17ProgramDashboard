"""Import programs from SAA recertification spreadsheet into the database.

Reads the .xlsx file from the configured DATA_DIR. Maps columns from the
Idaho SAA Program Spreadsheet format to the Program model.

Usage:
    python -m app.services.import_programs <filename>

The filename is relative to DATA_DIR (set in .env).
"""

import asyncio
import sys
from pathlib import Path

import openpyxl
from sqlalchemy import select

from app.config import settings
from app.db.base import Base
from app.db.engine import async_session, engine
from app.models.program import (
    ApprovalStatus,
    EducationalObjective,
    Modality,
    Program,
    ProgramLengthMeasurement,
)

COLUMN_MAP = {
    1: "program_name",
    2: "is_accredited",
    3: "educational_objective",
    4: "has_concentrations",
    5: "approval_status",
    6: "effective_date",
    7: "date_instruction_began",
    8: "total_credit_hours",
    9: "program_length_measurement",
    10: "full_time_enrollment_hours",
    14: "catalog_page",
    15: "is_license_cert_prep",
    16: "modality",
    17: "is_contracted",
    22: "comments",
}

BOOL_MAP = {"yes": True, "no": False}

OBJECTIVE_ALIASES = {
    "associate": EducationalObjective.ASSOCIATE,
    "bachelor": EducationalObjective.BACHELOR,
    "certificate": EducationalObjective.CERTIFICATE,
    "diploma": EducationalObjective.DIPLOMA,
    "doctorate": EducationalObjective.DOCTORATE,
    "graduate cert": EducationalObjective.GRADUATE_CERT,
    "grad cert": EducationalObjective.GRADUATE_CERT,
    "grad certificate": EducationalObjective.GRADUATE_CERT,
    "masters": EducationalObjective.MASTERS,
    "academy": EducationalObjective.ACADEMY,
    "apprenticeship": EducationalObjective.APPRENTICESHIP,
    "ojt": EducationalObjective.OJT,
    "journeyman": EducationalObjective.JOURNEYMAN,
    "vocational": EducationalObjective.VOCATIONAL,
    "other": EducationalObjective.OTHER,
}

STATUS_ALIASES = {
    "new approved": ApprovalStatus.NEW_APPROVED,
    "new": ApprovalStatus.NEW_APPROVED,
    "still approved": ApprovalStatus.STILL_APPROVED,
    "no longer offered": ApprovalStatus.NO_LONGER_OFFERED,
    "name change": ApprovalStatus.NAME_CHANGE,
    "withdrawn": ApprovalStatus.WITHDRAWN,
    "teach out phase": ApprovalStatus.TEACH_OUT_PHASE,
    "teach out": ApprovalStatus.TEACH_OUT_PHASE,
    "deemed approved": ApprovalStatus.DEEMED_APPROVED,
}

MEASUREMENT_ALIASES = {
    "semester": ProgramLengthMeasurement.SEMESTER,
    "semester hrs": ProgramLengthMeasurement.SEMESTER,
    "quarter": ProgramLengthMeasurement.QUARTER,
    "quarter hrs": ProgramLengthMeasurement.QUARTER,
    "clock": ProgramLengthMeasurement.CLOCK,
    "clock hrs": ProgramLengthMeasurement.CLOCK,
    "months": ProgramLengthMeasurement.MONTHS,
    "years": ProgramLengthMeasurement.YEARS,
}

MODALITY_ALIASES = {
    "resident": Modality.RESIDENT,
    "distance": Modality.DISTANCE,
    "distant": Modality.DISTANCE,
    "hybrid": Modality.HYBRID,
    "both": Modality.BOTH,
}


def parse_bool(value) -> bool | None:
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        return BOOL_MAP.get(value.strip().lower())
    return None


def parse_row(row_num: int, row: tuple) -> dict | None:
    """Parse a spreadsheet row into a dict for Program creation."""
    program_name = row[1]
    if not program_name or not isinstance(program_name, str):
        return None
    program_name = program_name.strip()
    if not program_name or program_name.startswith("Column"):
        return None

    obj_raw = str(row[3] or "").strip().lower() if row[3] else None
    objective = OBJECTIVE_ALIASES.get(obj_raw) if obj_raw else None
    if not objective:
        return None

    status_raw = str(row[5] or "").strip().lower() if row[5] else None
    status = STATUS_ALIASES.get(status_raw) if status_raw else None
    if not status:
        return None

    meas_raw = str(row[9] or "").strip().lower() if row[9] else None
    measurement = MEASUREMENT_ALIASES.get(meas_raw) if meas_raw else None
    if not measurement:
        measurement = ProgramLengthMeasurement.SEMESTER

    mod_raw = str(row[16] or "").strip().lower() if row[16] else None
    modality = MODALITY_ALIASES.get(mod_raw) if mod_raw else None
    if not modality:
        modality = Modality.BOTH

    credit_hours = row[8]
    if isinstance(credit_hours, str):
        try:
            credit_hours = int(credit_hours)
        except ValueError:
            credit_hours = None

    ft_hours = row[10]
    if isinstance(ft_hours, str):
        try:
            ft_hours = int(ft_hours)
        except ValueError:
            ft_hours = 12
    if not ft_hours:
        ft_hours = 12

    catalog_page = str(row[14] or "").strip() if row[14] else ""
    if not catalog_page:
        catalog_page = "N/A"

    effective_date = None
    if row[6]:
        from datetime import date, datetime

        if isinstance(row[6], datetime):
            effective_date = row[6].date()
        elif isinstance(row[6], date):
            effective_date = row[6]

    return {
        "row_number": row_num,
        "program_name": program_name,
        "is_accredited": parse_bool(row[2]) or False,
        "educational_objective": objective,
        "has_concentrations": parse_bool(row[4]) or False,
        "approval_status": status,
        "effective_date": effective_date,
        "total_credit_hours": credit_hours if isinstance(credit_hours, int) else None,
        "program_length_measurement": measurement,
        "full_time_enrollment_hours": ft_hours,
        "catalog_page": catalog_page,
        "is_license_cert_prep": parse_bool(row[15]) or False,
        "modality": modality,
        "is_contracted": parse_bool(row[17]) or False,
        "comments": str(row[21]).strip() if row[21] else None,
    }


async def import_from_xlsx(filepath: Path, dry_run: bool = False) -> dict:
    """Import programs from an xlsx file. Returns summary stats."""
    wb = openpyxl.load_workbook(filepath, read_only=True, data_only=True)

    sheet = None
    for name in wb.sheetnames:
        if "program" in name.lower() and "instruction" not in name.lower():
            sheet = wb[name]
            break
    if not sheet:
        sheet = wb[wb.sheetnames[0]]

    programs = []
    skipped = 0
    for idx, row in enumerate(sheet.iter_rows(min_row=1, values_only=True), start=1):
        if idx <= 4:
            continue
        parsed = parse_row(idx - 4, row)
        if parsed:
            programs.append(parsed)
        else:
            skipped += 1

    wb.close()

    if dry_run:
        return {"parsed": len(programs), "skipped": skipped, "imported": 0}

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as session:
        existing = (await session.execute(select(Program.program_name))).scalars().all()
        existing_names = set(existing)

        imported = 0
        for prog_data in programs:
            if prog_data["program_name"] not in existing_names:
                session.add(Program(**prog_data))
                existing_names.add(prog_data["program_name"])
                imported += 1

        await session.commit()

    return {"parsed": len(programs), "skipped": skipped, "imported": imported}


async def main():
    if len(sys.argv) < 2:
        print("Usage: python -m app.services.import_programs <filename>")
        print("  <filename> is relative to DATA_DIR (set in .env)")
        sys.exit(1)

    filename = sys.argv[1]
    if settings.DATA_DIR:
        filepath = Path(settings.DATA_DIR) / filename
    else:
        filepath = Path(filename)

    if not filepath.exists():
        print(f"File not found: {filepath}")
        sys.exit(1)

    dry_run = "--dry-run" in sys.argv
    result = await import_from_xlsx(filepath, dry_run=dry_run)
    mode = "DRY RUN" if dry_run else "IMPORT"
    print(
        f"[{mode}] Parsed: {result['parsed']}, "
        f"Skipped: {result['skipped']}, "
        f"Imported: {result['imported']}"
    )


if __name__ == "__main__":
    asyncio.run(main())
