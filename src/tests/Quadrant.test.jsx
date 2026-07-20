import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Quadrant from '../components/Quadrant';
import { QUADRANTS } from '../constants';

describe('Quadrant Component', () => {
  const mockTasks = [
    { id: '1', text: 'Do First Task', quadrant: 'do', done: false },
    { id: '2', text: 'Schedule Task', quadrant: 'decide', done: false },
    { id: '3', text: 'Another Do First Task', quadrant: 'do', done: true },
  ];

  const doQuadrant = QUADRANTS.find(q => q.id === 'do');

  it('renders quadrant header and title correctly', () => {
    render(
      <Quadrant
        q={doQuadrant}
        index={0}
        tasks={[]}
        clearDone={vi.fn()}
      />
    );
    expect(screen.getByText('Do First: Urgent & Important')).toBeInTheDocument();
  });

  it('filters and renders only tasks for this quadrant', () => {
    render(
      <Quadrant
        q={doQuadrant}
        index={0}
        tasks={mockTasks}
        clearDone={vi.fn()}
      />
    );
    
    // Should render the two tasks in the 'do' quadrant
    expect(screen.getByText('Do First Task')).toBeInTheDocument();
    expect(screen.getByText('Another Do First Task')).toBeInTheDocument();
    
    // Should NOT render the task in the 'decide' quadrant
    expect(screen.queryByText('Schedule Task')).not.toBeInTheDocument();
  });

  it('calls clearDone when clear button is clicked', () => {
    const clearDoneMock = vi.fn();
    render(
      <Quadrant
        q={doQuadrant}
        index={0}
        tasks={mockTasks}
        clearDone={clearDoneMock}
      />
    );
    
    const clearButton = screen.getByText('Clear');
    fireEvent.click(clearButton);
    expect(clearDoneMock).toHaveBeenCalledWith('do');
  });
});
