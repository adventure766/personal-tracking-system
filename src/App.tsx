import React, { useState, useEffect, useMemo } from "react";
import { Inbox } from "lucide-react";
import { Task, List, FilterType } from "./types";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { TaskItem } from "./components/TaskItem";
import { NewTaskModal } from "./components/NewTaskModal";

const INITIAL_LISTS: List[] = [
  { id: "inbox", name: "Personal", icon: "Inbox", color: "blue" },
  { id: "work", name: "Professional", icon: "Briefcase", color: "green" },
  { id: "hobbies", name: "Learning", icon: "Book", color: "emerald" },
];

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("aura-tasks");

    if (!saved) return [];

    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });
  const [lists] = useState<List[]>(INITIAL_LISTS);
  const [activeListId, setActiveListId] = useState<string>("inbox");
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem("aura-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        (task.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (task.description?.toLowerCase() || "").includes(
          searchQuery.toLowerCase(),
        );
      const matchesList = filter === "all" ? task.listId === activeListId : true;

      let matchesFilter = true;
      if (filter === "starred") matchesFilter = task.isStarred;
      if (filter === "completed") matchesFilter = task.isCompleted;
      if (filter === "upcoming")
        matchesFilter = !task.isCompleted && !!task.dueDate && new Date(task.dueDate) >= new Date();

      return matchesSearch && matchesList && matchesFilter;
    });
  }, [tasks, activeListId, filter, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: tasks.length,
      completed: tasks.filter((t) => t.isCompleted).length,
      pending: tasks.filter((t) => !t.isCompleted).length,
    };
  }, [tasks]);

  const toggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, isCompleted: !t.isCompleted } : t,
      ),
    );
  };

  const toggleStar = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isStarred: !t.isStarred } : t)),
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleCreateTask = (title: string, description: string, dueDate?: string) => {
    const newTask: Task = {
      id: Math.random().toString(36).substring(7),
      title,
      description,
      isCompleted: false,
      isStarred: false,
      listId: activeListId,
      createdAt: Date.now(),
      dueDate,
      subtasks: [],
    };

    setTasks((prev) => [newTask, ...prev]);
    setShowNewTaskModal(false);
  };

  const currentViewTitle = useMemo(() => {
    if (filter === "all")
      return lists.find((l) => l.id === activeListId)?.name || "Inbox";
    return filter.charAt(0).toUpperCase() + filter.slice(1);
  }, [filter, activeListId, lists]);

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        filter={filter}
        setFilter={setFilter}
        activeListId={activeListId}
        setActiveListId={setActiveListId}
        lists={lists}
      />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          completedCount={stats.completed}
          totalCount={stats.total}
          onNewTaskClick={() => setShowNewTaskModal(true)}
        />

        <div className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-1">
                  {currentViewTitle}
                </h2>
                <p className="text-slate-500">
                  You have {filteredTasks.length} tasks matching this view.
                </p>
              </div>
              <div className="flex gap-2">
                <div className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-indigo-600 border border-slate-200 shadow-sm">
                  {stats.pending} Pending
                </div>
                <div className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-emerald-600 border border-slate-200 shadow-sm">
                  {stats.completed} Done
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggleComplete={() => toggleComplete(task.id)}
                    onToggleStar={() => toggleStar(task.id)}
                    onDelete={() => deleteTask(task.id)}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 text-slate-300">
                    <Inbox size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-700">
                    All clear!
                  </h3>
                  <p className="text-slate-400 mt-2 max-w-xs">
                    No tasks found here. Take a break or start something new.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <NewTaskModal
          isOpen={showNewTaskModal}
          onClose={() => setShowNewTaskModal(false)}
          onCreate={handleCreateTask}
        />
      </main>
    </div>
  );
};

export default App;
