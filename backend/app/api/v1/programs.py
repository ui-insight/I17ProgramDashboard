"""CRUD API routes for Program resource."""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.engine import get_db
from app.models.program import ApprovalStatus, EducationalObjective, Modality, Program
from app.schemas.program import (
    ProgramCreate,
    ProgramListResponse,
    ProgramResponse,
    ProgramUpdate,
)

router = APIRouter()


@router.get("/", response_model=ProgramListResponse)
async def list_programs(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    search: str | None = None,
    approval_status: ApprovalStatus | None = None,
    educational_objective: EducationalObjective | None = None,
    modality: Modality | None = None,
    is_accredited: bool | None = None,
    db: AsyncSession = Depends(get_db),
):
    """List programs with optional filtering and pagination."""
    query = select(Program)
    count_query = select(func.count(Program.id))

    if search:
        query = query.where(Program.program_name.ilike(f"%{search}%"))
        count_query = count_query.where(Program.program_name.ilike(f"%{search}%"))
    if approval_status:
        query = query.where(Program.approval_status == approval_status)
        count_query = count_query.where(Program.approval_status == approval_status)
    if educational_objective:
        query = query.where(Program.educational_objective == educational_objective)
        count_query = count_query.where(
            Program.educational_objective == educational_objective
        )
    if modality:
        query = query.where(Program.modality == modality)
        count_query = count_query.where(Program.modality == modality)
    if is_accredited is not None:
        query = query.where(Program.is_accredited == is_accredited)
        count_query = count_query.where(Program.is_accredited == is_accredited)

    total = (await db.execute(count_query)).scalar() or 0

    query = query.order_by(Program.row_number.asc().nulls_last(), Program.program_name)
    query = query.offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(query)
    programs = result.scalars().all()

    return ProgramListResponse(
        items=programs, total=total, page=page, page_size=page_size
    )


@router.get("/{program_id}", response_model=ProgramResponse)
async def get_program(program_id: str, db: AsyncSession = Depends(get_db)):
    """Get a single program by ID."""
    result = await db.execute(select(Program).where(Program.id == program_id))
    program = result.scalar_one_or_none()
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    return program


@router.post("/", response_model=ProgramResponse, status_code=201)
async def create_program(data: ProgramCreate, db: AsyncSession = Depends(get_db)):
    """Create a new program."""
    program = Program(**data.model_dump())
    db.add(program)
    await db.commit()
    await db.refresh(program)
    return program


@router.put("/{program_id}", response_model=ProgramResponse)
async def update_program(
    program_id: str, data: ProgramUpdate, db: AsyncSession = Depends(get_db)
):
    """Update an existing program."""
    result = await db.execute(select(Program).where(Program.id == program_id))
    program = result.scalar_one_or_none()
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(program, field, value)

    await db.commit()
    await db.refresh(program)
    return program


@router.delete("/{program_id}", status_code=204)
async def delete_program(program_id: str, db: AsyncSession = Depends(get_db)):
    """Delete a program."""
    result = await db.execute(select(Program).where(Program.id == program_id))
    program = result.scalar_one_or_none()
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")

    await db.delete(program)
    await db.commit()
