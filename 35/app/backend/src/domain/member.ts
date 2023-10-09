import { Id } from './id';
import { Task } from './task';

export class AssignedTask {
  readonly value: {
    readonly id: Id;
    readonly taskId: Task['value']['id'];
    readonly status: '未着手' | 'レビュー待ち' | '完了';
  };
  constructor(input: AssignedTask['value']) {
    this.value = input;
  }
  changeStatus(status: AssignedTask['value']['status']) {
    if (this.value.status === '完了') {
      throw new Error();
    }
    return new AssignedTask({
      ...this.value,
      status,
    });
  }
}

export class Member {
  readonly value: {
    readonly id: Id;
    readonly status: 'ACTIVE' | 'PAUSING' | 'INACTIVE';
    readonly name: string;
    readonly email: string;
    readonly assignedTasks: AssignedTask[];
  };
  constructor(input: Member['value']) {
    this.value = input;
  }
  assignTasks(tasks: Task[]) {
    if (
      this.value.assignedTasks.some((assignedTask) =>
        tasks.some((task) => assignedTask.value.taskId.equals(task.value.id)),
      )
    ) {
      throw new Error();
    }
    return new Member({
      ...this.value,
      assignedTasks: [
        ...this.value.assignedTasks,
        ...tasks.map(
          (task) =>
            new AssignedTask({
              id: Id.init(),
              taskId: task.value.id,
              status: '未着手',
            }),
        ),
      ],
    });
  }
  toObject() {
    const { id, ...rest } = this.value;
    return {
      ...rest,
      id: id.toString(),
    };
  }
}
