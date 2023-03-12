import mongoose, { Schema, Document } from 'mongoose';

export type QueueItemStatus = 'completed' | 'failed' | 'pending' | 'new';
export type QueueItemType = 'upload' | 'convert';

export interface Queue extends Pick<Document, '_id'> {
  data: Record<any, any>;
  run_on: Date;
  status: QueueItemStatus;
  type?:QueueItemType;
  job: string;
  complete_message?: string;
}

const QueueSchema: Schema<Queue> = new Schema(
  {
    data: {
      type: Object,
      required: true,
    },
    run_on: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      index: true,
    },
    type:{
        type: String,
        required: false,   
    },
    job: {
      type: String,
      required: true,
      index: true
    },
    complete_message: {
      type: String,
      required: false
    }
  },
  { timestamps: true },
);

const QueueModel = mongoose.model('Queue', QueueSchema, 'queue');

export default QueueModel;
