import mongoose, { Schema, Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface LoginAttempt extends Pick<Document, '_id'> {
  user_id: ObjectId;
  logged_out?: boolean;
  logged_in_at?: string;
  logged_out_at?: string;
  ip_address?: string;
  token_id: string;
  user_agent?: string;
}

const LoginAttemptSchema: Schema<LoginAttempt> = new Schema(
  {
    user_id: {
      type: ObjectId,
      required: true,
    },
    ip_address: {
      type: String,
      required: false,
    },
    user_agent: {
      type: String,
      required: false,
    },
    token_id: {
      type: String,
      unique: true,
      required: true,
    },
    logged_in_at: {
      type: Date,
      required: false,
    },
    logged_out: {
      type: Boolean,
      required: false,
      default: false,
    },
    logged_out_at: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true },
);

const LoginAttemptModel = mongoose.model('LoginAttempt', LoginAttemptSchema);

export default LoginAttemptModel;
