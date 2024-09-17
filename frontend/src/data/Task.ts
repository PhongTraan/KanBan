type Id = Number | string;

export type Task = {
  id: number;
  title: string;
  dueDate: Date | null;
  isPublic: boolean;
  description: string;
  from: string;
  position: number;
  assignedUserId: number;
};

export type MoveTask = {
  taskId: Id;
  overPosition: number;
  overStatus: string;
};
