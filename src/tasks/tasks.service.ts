import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDTO } from './dto/create.task.dto';
import { GetTaskFilterDTO } from './dto/get-task-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  async getAllTasks(): Promise<Task[]> {
    return await this.tasks;
  }

  async getTasksWithFilters(filterDto: GetTaskFilterDTO) {
    const { status, search } = filterDto;

    let tasks = await this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          task.description.includes(search),
      );
    }

    return tasks;
  }

  async createTask(createTaskDto: CreateTaskDTO): Promise<Task> {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuidv4(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    await this.tasks.push(task);
    return task;
  }

  async getTaskById(id: string): Promise<Task> {
    return await this.tasks.find((task) => task.id === id);
  }

  async deleteTaskById(id: string): Promise<void> {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  async updateTaskStatus(id: string, status: TaskStatus) {
    const task = await this.getTaskById(id);

    console.log(task);
    console.log(status);

    task.status = status;

    return task;
  }
}
