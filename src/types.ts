
export interface Task {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isStarred: boolean;
  listId: string;
  createdAt: number;
  dueDate?: string;
  subtasks?: string[];
}

export interface List {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export type FilterType = 'all' | 'starred' | 'completed' | 'upcoming';
