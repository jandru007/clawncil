import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    let query = supabase.from('tasks').select('*').order('created_at', { ascending: false });
    
    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ tasks: data || [] });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, status, priority, assignee, tags, projectId } = await request.json();

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        project_id: projectId,
        title,
        description,
        status,
        priority,
        assignee,
        tags: tags || [],
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ task: data });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const task = await request.json();

    const { data, error } = await supabase
      .from('tasks')
      .update({
        status: task.status,
        title: task.title,
        description: task.description,
        priority: task.priority,
        assignee: task.assignee,
      })
      .eq('id', task.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ task: data });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
