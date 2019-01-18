export interface Task {
  id?: string;
  desc: string;
  completed: boolean;
  priority: number;
  // order: number;
  dueDate?: Date;
  reminder?: Date;
  ownerId: string;

  participantIds: string[];
  taskListId: string;

  remark?: string;
  // tags?: string[];
  createDate?: Date;
}
