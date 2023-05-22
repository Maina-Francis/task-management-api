import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDTO } from './dto/create.task.dto';
import { GetTaskFilterDTO } from './dto/get-task-filter.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { Model } from 'mongoose';
import { TaskStatus } from './tasks.model';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async getAllTasks(): Promise<TaskDocument[]> {
    return await this.taskModel.find().exec();
  }

  async getTasksWithFilters(
    filterDto: GetTaskFilterDTO,
  ): Promise<TaskDocument[]> {
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

  async createTask(createTaskDto: CreateTaskDTO): Promise<TaskDocument> {
    const { title, description } = createTaskDto;

    const task = new this.taskModel({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await task.save();
    return task;
  }

  async getTaskById(id: string): Promise<TaskDocument> {
    const task = await this.taskModel.findById(id).exec();

    // Exception handling
    if (!task) {
      throw new HttpException(
        `The task with ID ${id} wasn't found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return task;
  }

  async deleteTaskById(id: string): Promise<void> {
    await this.getTaskById(id);

    await this.taskModel.findByIdAndDelete(id).exec();
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
  ): Promise<TaskDocument> {
    const task = await this.getTaskById(id);

    task.status = status;
    await task.save();

    return task;
  }
}
