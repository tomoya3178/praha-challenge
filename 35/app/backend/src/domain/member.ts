import { InternalServerErrorException } from '@nestjs/common';
import { Id } from './id';
import { Task } from './task';

export class AssignedTask {
  readonly value: {
    readonly id: Id;
    readonly taskId: Task['value']['id'];
    readonly status: 'UNDONE' | 'REVIEWING' | 'DONE';
  };
  constructor(input: AssignedTask['value']) {
    this.value = input;
  }
  changeStatus(status: AssignedTask['value']['status']) {
    if (this.value.status === 'DONE') {
      throw new Error();
    }
    return new AssignedTask({
      ...this.value,
      status,
    });
  }
  toObject() {
    const { id, taskId, ...rest } = this.value;
    return {
      ...rest,
      id: id.toString(),
      taskId: taskId.toString(),
    };
  }
}

export class Member {
  readonly value: {
    readonly id: Id;
    readonly status: 'ACTIVE' | 'PAUSING' | 'INACTIVE';
    readonly name: string;
    readonly email: string;
    readonly assignedTasks: ReadonlyArray<AssignedTask>;
  };
  constructor(input: Member['value']) {
    this.value = input;
  }
  changeStatus(status: Member['value']['status']) {
    if (this.value.status === status) {
      throw new InternalServerErrorException();
    }
    return new Member({
      ...this.value,
      status,
    });
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
              status: 'UNDONE',
            }),
        ),
      ],
    });
  }
  changeAssignedTaskStatus(
    taskId: AssignedTask['value']['id'],
    input: AssignedTask['value']['status'],
  ) {
    return new Member({
      ...this.value,
      assignedTasks: this.value.assignedTasks.map((assignedTask) => {
        if (taskId.equals(assignedTask.value.id)) {
          return assignedTask.changeStatus(input);
        }
        return assignedTask;
      }),
    });
  }
  toObject() {
    const { id, assignedTasks, ...rest } = this.value;
    return {
      ...rest,
      id: id.toString(),
      assignedTasks: assignedTasks.map((assignedTask) =>
        assignedTask.toObject(),
      ),
    };
  }
}
