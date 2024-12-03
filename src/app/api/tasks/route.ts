import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Task from '@/models/Task';

// GET /api/tasks
export async function GET() {
  await dbConnect();
  const tasks = await Task.find({});
  return NextResponse.json(tasks);
}

// POST /api/tasks
export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  const task = await Task.create(body);
  return NextResponse.json(task, { status: 201 });
}