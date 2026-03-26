
import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Star, 
  Trash2, 
  ChevronRight, 
  Clock,
  Calendar
} from 'lucide-react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggleComplete: () => void;
  onToggleStar: () => void;
  onDelete: () => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  onToggleComplete, 
  onToggleStar, 
  onDelete 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`task-card group border border-slate-200 rounded-2xl overflow-hidden shadow-sm ${task.isCompleted ? 'bg-slate-50/50' : 'bg-white'}`}>
      <div className="p-4 flex items-center gap-4">
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleComplete(); }}
          className={`transition-colors p-1 flex-shrink-0 ${task.isCompleted ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-500'}`}
        >
          {task.isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
        </button>

        <div className="flex-1 cursor-pointer min-w-0" onClick={() => setIsExpanded(!isExpanded)}>
          <h4 className={`font-semibold text-lg transition-all truncate ${task.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'}`}>
            {task.title}
          </h4>
          {task.dueDate && (
            <p className={`text-xs font-semibold flex items-center gap-1 mt-0.5 ${
              new Date(task.dueDate) < new Date() && !task.isCompleted
                ? 'text-red-500'
                : 'text-indigo-500'
            }`}>
              <Calendar size={12} />
              {new Date(task.dueDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          )}
          {task.description && !isExpanded && (
            <p className="text-sm text-slate-500 line-clamp-1">{task.description}</p>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleStar(); }}
            className={`p-2 rounded-lg hover:bg-slate-100 transition-colors ${task.isStarred ? 'text-amber-500' : 'text-slate-300 hover:text-amber-500'}`}
          >
            <Star size={18} fill={task.isStarred ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-2 rounded-lg hover:bg-red-50 hover:text-red-500 text-slate-300 transition-colors"
          >
            <Trash2 size={18} />
          </button>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-2 rounded-lg hover:bg-slate-100 text-slate-300 transition-transform ${isExpanded ? 'rotate-90 text-slate-500' : ''}`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="px-14 pb-4 animate-in slide-in-from-top-2 duration-200">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
              {task.description || "No description provided."}
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <div className="flex items-center gap-1">
                <Clock size={14} />
                Created {new Date(task.createdAt).toLocaleDateString()}
              </div>
              {task.dueDate && (
                <div className={`flex items-center gap-1 ${
                  new Date(task.dueDate) < new Date() && !task.isCompleted ? 'text-red-500' : 'text-indigo-500'
                }`}>
                  <Calendar size={14} />
                  Due {new Date(task.dueDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </div>
              )}
              {task.isStarred && (
                <div className="flex items-center gap-1 text-amber-600">
                  <Star size={14} fill="currentColor" />
                  Prioritized
                </div>
              )}
              {task.isCompleted && (
                <div className="flex items-center gap-1 text-emerald-600">
                  <CheckCircle2 size={14} />
                  Completed
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
