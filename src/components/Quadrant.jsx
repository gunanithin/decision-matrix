import React from 'react';
import TaskItem from './TaskItem';
import { CheckCircleIcon, CalendarIcon, UserIcon, TrashIcon } from './Icons';

export default function Quadrant({ q, index, tasks, clearDone, toggleDone, editTask, cycle, removeTask }) {
  const quadrantTasks = tasks.filter(t => t.quadrant === q.id);

  const getIcon = () => {
    switch (q.id) {
      case 'do': return <CheckCircleIcon />;
      case 'decide': return <CalendarIcon />;
      case 'delegate': return <UserIcon />;
      case 'delete': return <TrashIcon />;
      default: return null;
    }
  };

  return (
    <div className={`quadrant quadrant-${q.id}`} style={{ backgroundColor: q.color }}>
      <div className="q-header-top">
        <span className="q-quadrant-number">QUADRANT #{index + 1}</span>
      </div>

      <div className="q-icon-container">
        {getIcon()}
      </div>

      <div className="q-title-container">
        <h2 className="q-title-main">{q.title}</h2>
        <p className="q-subtitle">{q.subtitle}</p>
      </div>
      
      <div className="q-actions">
        <button className="q-clear" onClick={() => clearDone(q.id)}>Clear Done</button>
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
