import React from "react";
import { Search, Plus } from "lucide-react";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  completedCount: number;
  totalCount: number;
  onNewTaskClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  completedCount,
  totalCount,
  onNewTaskClick,
}) => {
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <header className="h-20 border-b border-slate-200 px-8 flex items-center justify-between bg-white/80 backdrop-blur-md z-10">
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        <div className="relative w-full group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Search your tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 ml-8">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
            Productivity
          </span>
          <div className="h-1 w-24 bg-slate-100 rounded-full mt-1 overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <button
  onClick={onNewTaskClick}
  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-semibold shadow-lg shadow-green-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
>
  <Plus size={20} />
  New Task
</button>
      </div>
    </header>
  );
};
