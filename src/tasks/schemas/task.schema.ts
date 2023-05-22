import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TaskStatus } from '../tasks.model';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  status: TaskStatus;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
