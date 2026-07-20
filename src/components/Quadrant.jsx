import React from 'react';
import TaskItem from './TaskItem';

export default function Quadrant({ q, index, tasks, clearDone, toggleDone, editTask, cycle, removeTask }) {
  const quadrantTasks = tasks.filter(t => t.quadrant === q.id);

  return (
    <div className={`quadrant quadrant-${q.id}`}>
      <div className="q-image-container">
        <img src={q.image} alt={q.title} className="q-image" />
      </div>

      <div className="q-header">
        <div className="q-title-wrapper">
          <span className="q-badge">{index + 1}</span>
          <span className="q-title">{q.title}</span>
        </div>
        <button className="q-clear" onClick={() => clearDone(q.id)}>Clear</button>
      </div>

      <div className="q-tasks">
        {quadrantTasks.map(t => (
          <TaskItem
            key={t.id}
            t={t}
            toggleDone={toggleDone}
            editTask={editTask}
            cycle={cycle}
            removeTask={removeTask}
          />
        ))}
        {quadrantTasks.length === 0 && (
          <div className="q-empty">No tasks in this quadrant</div>
        )}
      </div>
    </div>
  );
}
