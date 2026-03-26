import React from "react";
import {
  Inbox,
  Star,
  CheckCircle2,
  Calendar,
  Hash,
  Menu,
  X,
  Layout,
} from "lucide-react";
import { List, FilterType } from "../types";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  activeListId: string;
  setActiveListId: (id: string) => void;
  lists: List[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  filter,
  setFilter,
  activeListId,
  setActiveListId,
  lists,
}) => {
  return (
    <aside
      className={`${isSidebarOpen ? "w-72" : "w-20"} bg-white transition-all duration-300 flex flex-col border-r border-slate-200 shadow-sm`}
    >
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
          <Layout className="w-5 h-5 text-white" />
        </div>
        {isSidebarOpen && (
          <h1 className="text-xl font-bold tracking-tight text-slate-800 truncate">
            Personal Tracking system
            <p className="text-xs tracking-normal text-slate-400 font-medium mt-0.5">
              All rights reserved {new Date().getFullYear()}{" "}
            </p>
          </h1>
        )}
      </div>

      <div className="px-4 py-2 space-y-1 overflow-y-auto flex-1">
        {isSidebarOpen && (
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
            Smart Views
          </p>
        )}
        <SidebarItem
          icon={<Inbox size={20} />}
          label="All Tasks"
          active={filter === "all" && activeListId === "inbox"}
          onClick={() => {
            setFilter("all");
            setActiveListId("inbox");
          }}
          isOpen={isSidebarOpen}
        />
        <SidebarItem
          icon={<Star size={20} />}
          label="Starred"
          active={filter === "starred"}
          onClick={() => setFilter("starred")}
          isOpen={isSidebarOpen}
        />
        <SidebarItem
          icon={<CheckCircle2 size={20} />}
          label="Completed"
          active={filter === "completed"}
          onClick={() => setFilter("completed")}
          isOpen={isSidebarOpen}
        />
        <SidebarItem
          icon={<Calendar size={20} />}
          label="Upcoming"
          active={filter === "upcoming"}
          onClick={() => setFilter("upcoming")}
          isOpen={isSidebarOpen}
        />

        <div className="mt-8">
          {isSidebarOpen && (
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
              My Lists
            </p>
          )}
          {lists.map((list) => (
            <SidebarItem
              key={list.id}
              icon={<Hash size={20} className={`text-${list.color}-500`} />}
              label={list.name}
              active={
                activeListId === list.id &&
                filter !== "starred" &&
                filter !== "completed" &&
                filter !== "upcoming"
              }
              onClick={() => {
                setActiveListId(list.id);
                setFilter("all");
              }}
              isOpen={isSidebarOpen}
            />
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-slate-100">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </aside>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  isOpen: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  active,
  onClick,
  isOpen,
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all ${
      active
        ? "bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm"
        : "hover:bg-slate-50 text-slate-500 hover:text-slate-800"
    }`}
  >
    <span
      className={`flex-shrink-0 ${active ? "text-indigo-600" : "text-slate-400"}`}
    >
      {icon}
    </span>
    {isOpen && <span className="font-semibold text-sm truncate">{label}</span>}
  </button>
);
