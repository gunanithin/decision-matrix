import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskInput from '../components/TaskInput';
import { QUADRANTS } from '../constants';

describe('TaskInput Component', () => {
  it('calls addTask when the Add Task button is clicked', () => {
    const addTaskMock = vi.fn();
    render(
      <TaskInput
        text="New task"
        setText={vi.fn()}
        picked="do"
        setPicked={vi.fn()}
        addTask={addTaskMock}
        editingTaskId={null}
        cancelEdit={vi.fn()}
        dateInputRef={{ current: null }}
      />
    );
    
    const addButton = screen.getByText('Add Task');
    fireEvent.click(addButton);
    expect(addTaskMock).toHaveBeenCalled();
  });

  it('shows Edit Task button when editingTaskId is set', () => {
    render(
      <TaskInput
        text="Editing this task"
        setText={vi.fn()}
        picked="do"
        setPicked={vi.fn()}
        addTask={vi.fn()}
        editingTaskId="123"
        cancelEdit={vi.fn()}
        dateInputRef={{ current: null }}
      />
    );
    
    expect(screen.getByText('Save Edit')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.queryByText('Add Task')).not.toBeInTheDocument();
  });

  it('renders quadrant selection options correctly', () => {
    render(
      <TaskInput
        text=""
        setText={vi.fn()}
        picked="do"
        setPicked={vi.fn()}
        addTask={vi.fn()}
        editingTaskId={null}
        cancelEdit={vi.fn()}
        dateInputRef={{ current: null }}
      />
    );
    
    QUADRANTS.forEach(q => {
      // It should render options for each quadrant's shortTitle
      expect(screen.getByRole('option', { name: q.shortTitle })).toBeInTheDocument();
    });
  });
});
