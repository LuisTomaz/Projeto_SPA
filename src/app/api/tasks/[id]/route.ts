import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Task from '@/models/Task';

interface Params {
  params: { id: string };
}

// DELETE /api/tasks/[id]
export async function DELETE(request: Request, { params }: Params) {
  const { id } = params;

  await dbConnect();

  try {
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Task deleted successfully', task: deletedTask }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}

// PATCH /api/tasks/[id]
export async function PATCH(request: Request, { params }: Params) {
  const { id } = params;
  const body = await request.json();

  await dbConnect();

  try {
    const updatedTask = await Task.findByIdAndUpdate(id, body, {
      new: true, // Retorna o documento atualizado
      runValidators: true, // Executa validações no esquema
    });

    if (!updatedTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Task updated successfully', task: updatedTask }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update task', details: error.message }, { status: 500 });
  }
}


// Edit
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const { id } = params;

    // Verifica se o ID é válido
    if (!id) {
      return NextResponse.json({ error: 'ID da tarefa não fornecido.' }, { status: 400 });
    }

    const task = await Task.findById(id);

    if (!task) {
      return NextResponse.json({ error: 'Tarefa não encontrada.' }, { status: 404 });
    }

    return NextResponse.json({ task }, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar a tarefa:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
