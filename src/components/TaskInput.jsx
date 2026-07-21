import React from 'react';
import { PlusIcon } from './Icons';
import { QUADRANTS } from '../constants';

export default function TaskInput({
  text, setText, picked, setPicked, setDueDate, setDueTime,
  addTask, editingTaskId, cancelEdit, dateInputRef
}) {
  return (
    <div className="em-add" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && addTask()}
        placeholder="Add a new task..."
        style={{ width: '100%' }}
      />

      {(picked === "decide" || picked === "delegate") && (
        <div className="em-add-schedule">
          <input
            ref={dateInputRef}
            placeholder={picked === "decide" ? "Select Date & Time..." : "Select Due Date..."}
            style={{ cursor: 'pointer' }}
          />
        </div>
      )}

      <div className="em-add-row" style={{ marginTop: '8px' }}>
        <select value={picked} onChange={(e) => { setPicked(e.target.value); setDueDate(""); setDueTime(""); }}>
          {QUADRANTS.map(q => <option key={q.id} value={q.id}>{q.title}</option>)}
        </select>
        
        <button onClick={addTask} className="em-add-btn" style={{ flex: 1 }}>
          {editingTaskId ? "Save Edit" : <><PlusIcon /> Add Task</>}
        </button>
        {editingTaskId && (
          <button onClick={cancelEdit} className="em-add-btn" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
