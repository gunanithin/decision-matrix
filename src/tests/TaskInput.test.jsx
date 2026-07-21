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
      // It should render options for each quadrant's title
      expect(screen.getByRole('option', { name: q.title })).toBeInTheDocument();
    });
  });

  it('calls setText when input changes', () => {
    const setTextMock = vi.fn();
    render(
      <TaskInput
        text=""
        setText={setTextMock}
        picked="do"
        setPicked={vi.fn()}
        addTask={vi.fn()}
        editingTaskId={null}
        cancelEdit={vi.fn()}
        dateInputRef={{ current: null }}
      />
    );
    
    const input = screen.getByPlaceholderText('Add a new task...');
    fireEvent.change(input, { target: { value: 'Typing...' } });
    expect(setTextMock).toHaveBeenCalledWith('Typing...');
  });

  it('calls addTask on Enter key', () => {
    const addTaskMock = vi.fn();
    render(
      <TaskInput
        text="Task text"
        setText={vi.fn()}
        picked="do"
        setPicked={vi.fn()}
        addTask={addTaskMock}
        editingTaskId={null}
        cancelEdit={vi.fn()}
        dateInputRef={{ current: null }}
      />
    );
    
    const input = screen.getByPlaceholderText('Add a new task...');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(addTaskMock).toHaveBeenCalled();
  });

  it('calls setPicked, setDueDate, and setDueTime when quadrant changes', () => {
    const setPickedMock = vi.fn();
    const setDueDateMock = vi.fn();
    const setDueTimeMock = vi.fn();
    
    render(
      <TaskInput
        text=""
        setText={vi.fn()}
        picked="do"
        setPicked={setPickedMock}
        setDueDate={setDueDateMock}
        setDueTime={setDueTimeMock}
        addTask={vi.fn()}
        editingTaskId={null}
        cancelEdit={vi.fn()}
        dateInputRef={{ current: null }}
      />
    );
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'decide' } });
    
    expect(setPickedMock).toHaveBeenCalledWith('decide');
    expect(setDueDateMock).toHaveBeenCalledWith('');
    expect(setDueTimeMock).toHaveBeenCalledWith('');
  });

  it('calls cancelEdit when Cancel button is clicked', () => {
    const cancelEditMock = vi.fn();
    render(
      <TaskInput
        text="Editing"
        setText={vi.fn()}
        picked="do"
        setPicked={vi.fn()}
        addTask={vi.fn()}
        editingTaskId="123"
        cancelEdit={cancelEditMock}
        dateInputRef={{ current: null }}
      />
    );
    
    const cancelBtn = screen.getByText('Cancel');
    fireEvent.click(cancelBtn);
    expect(cancelEditMock).toHaveBeenCalled();
  });

  it('shows date picker with specific placeholder for "decide"', () => {
    render(
      <TaskInput
        text=""
        setText={vi.fn()}
        picked="decide"
        setPicked={vi.fn()}
        addTask={vi.fn()}
        editingTaskId={null}
        cancelEdit={vi.fn()}
        dateInputRef={{ current: null }}
      />
    );
    expect(screen.getByPlaceholderText('Select Date & Time...')).toBeInTheDocument();
  });

  it('shows date picker with specific placeholder for "delegate"', () => {
    render(
      <TaskInput
        text=""
        setText={vi.fn()}
        picked="delegate"
        setPicked={vi.fn()}
        addTask={vi.fn()}
        editingTaskId={null}
        cancelEdit={vi.fn()}
        dateInputRef={{ current: null }}
      />
    );
    expect(screen.getByPlaceholderText('Select Due Date...')).toBeInTheDocument();
  });
});
