import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { useState } from 'react';
import App from '../App';

// Mock Firebase hooks to maintain pure local state during tests
vi.mock('../hooks/useFirebaseSync', () => ({
  useFirebaseSync: () => {
    const [tasks, setTasks] = useState([]);
    const [user, setUser] = useState(null);
    return {
      tasks,
      setTasks,
      user,
      setUser,
      syncStatus: 'idle',
      writeRemote: vi.fn(),
    };
  }
}));

vi.mock('../hooks/usePushNotifications', () => ({
  usePushNotifications: () => ({ enablePushNotifications: vi.fn() })
}));

describe('App Integration Tests', () => {
  beforeEach(() => {
    // Reset any mocks if necessary
    vi.clearAllMocks();
    // Provide window.scrollTo mock since JSDOM doesn't implement it
    window.scrollTo = vi.fn();
  });

  it('adds a new task to the Do First quadrant', () => {
    render(<App />);
    
    // Find input and type
    const input = screen.getByPlaceholderText(/Add a new task.../i);
    fireEvent.change(input, { target: { value: 'Buy groceries' } });
    
    // Add task
    const addButton = screen.getByText('Add Task');
    fireEvent.click(addButton);
    
    // Verify it appeared in the document
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
  });

  it('marks a task as done', () => {
    render(<App />);
    
    // Add task
    const input = screen.getByPlaceholderText(/Add a new task.../i);
    fireEvent.change(input, { target: { value: 'Wash car' } });
    fireEvent.click(screen.getByText('Add Task'));
    
    // Click checkbox
    const checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkbox);
    
    // Task should get the 'is-done' class which changes styling, 
    // we can verify the checkbox is checked.
    expect(checkbox).toBeChecked();
  });

  it('cycles a task to the Schedule quadrant (requiring date)', async () => {
    render(<App />);
    
    // Add task to 'Do'
    const input = screen.getByPlaceholderText(/Add a new task.../i);
    fireEvent.change(input, { target: { value: 'Book flight' } });
    fireEvent.click(screen.getByText('Add Task'));
    
    // Click Cycle button
    const cycleBtn = screen.getByTitle('Cycle Quadrant');
    fireEvent.click(cycleBtn);
    
    // Ensure it triggers edit mode because "Schedule" requires a date
    expect(screen.getByText('Save Edit')).toBeInTheDocument();
  });
});
