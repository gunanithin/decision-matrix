import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskItem from '../components/TaskItem';

describe('TaskItem Component', () => {
  const mockTask = {
    id: '123',
    text: 'Test task',
    done: false,
    quadrant: 'do',
    dueDate: '',
    dueTime: '',
  };

  it('renders task text correctly', () => {
    render(<TaskItem t={mockTask} />);
    expect(screen.getByText('Test task')).toBeInTheDocument();
  });

  it('calls toggleDone when checkbox is clicked', () => {
    const toggleDone = vi.fn();
    render(<TaskItem t={mockTask} toggleDone={toggleDone} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(toggleDone).toHaveBeenCalledWith('123');
  });

  it('shows edit and cycle buttons when not done', () => {
    render(<TaskItem t={mockTask} />);
    expect(screen.getByTitle('Edit Task')).toBeInTheDocument();
    expect(screen.getByTitle('Cycle Quadrant')).toBeInTheDocument();
  });

  it('hides edit and cycle buttons when done is true', () => {
    const doneTask = { ...mockTask, done: true };
    render(<TaskItem t={doneTask} />);
    expect(screen.queryByTitle('Edit Task')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Cycle Quadrant')).not.toBeInTheDocument();
  });

  it('calls editTask when edit button is clicked', () => {
    const editTask = vi.fn();
    render(<TaskItem t={mockTask} editTask={editTask} />);
    
    fireEvent.click(screen.getByTitle('Edit Task'));
    expect(editTask).toHaveBeenCalledWith('123');
  });

  it('calls cycle when cycle button is clicked', () => {
    const cycle = vi.fn();
    render(<TaskItem t={mockTask} cycle={cycle} />);
    
    fireEvent.click(screen.getByTitle('Cycle Quadrant'));
    expect(cycle).toHaveBeenCalledWith('123');
  });

  it('renders date badge if dueDate exists', () => {
    const datedTask = { ...mockTask, dueDate: '2026-07-21' };
    render(<TaskItem t={datedTask} />);
    expect(screen.getByText(/2026-07-21/)).toBeInTheDocument();
  });

  it('renders time badge if dueTime exists', () => {
    const timedTask = { ...mockTask, dueDate: '2026-07-21', dueTime: '14:00' };
    render(<TaskItem t={timedTask} />);
    expect(screen.getByText(/14:00/)).toBeInTheDocument();
  });

  it('calls removeTask when delete button is clicked', () => {
    const removeTask = vi.fn();
    render(<TaskItem t={mockTask} removeTask={removeTask} />);
    
    fireEvent.click(screen.getByTitle('Delete Task'));
    expect(removeTask).toHaveBeenCalledWith('123');
  });
});
