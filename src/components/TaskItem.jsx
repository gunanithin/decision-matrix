import React from 'react';
import { CycleIcon, PencilIcon, XIcon } from './Icons';

export default function TaskItem({ t, toggleDone, editTask, cycle, removeTask }) {
  return (
    <div className={`task ${t.done ? 'is-done' : ''}`}>
      <input type="checkbox" checked={t.done} onChange={() => toggleDone(t.id)} />
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <span className="task-text">{t.text}</span>
        {(t.dueDate || t.dueTime) && (
          <span className="task-time-badge" style={{ fontSize: '10px', color: 'rgba(13, 43, 33, 0.6)', marginTop: '4px', fontWeight: '600' }}>
            📅 {t.dueDate} {t.dueTime ? ` ⏰ ${t.dueTime}` : ''}
          </span>
        )}
      </div>
      <div className="task-actions">
        {!t.done && (
          <>
            <button className="task-btn" title="Edit Task" onClick={() => editTask(t.id)}><PencilIcon /></button>
            <button className="task-btn" title="Cycle Quadrant" onClick={() => cycle(t.id)}><CycleIcon /></button>
          </>
        )}
        <button className="task-btn" title="Delete Task" onClick={() => removeTask(t.id)}><XIcon /></button>
      </div>
    </div>
  );
}
