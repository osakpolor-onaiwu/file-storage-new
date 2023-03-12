import mongoose, { Schema, Document } from 'mongoose';
export interface Download extends Pick<Document, '_id'> {
  url?: string;
  accountid: string;
  file?: string;
  key?: string;
  type?: string;
}

const DownloadSchema: Schema<Download> = new Schema(
  {
    url: {
      type: String,
      required: false,
    },

    accountid: {
      type: String,
      required: false,
      index:true,
    },
    file: {
      type: String,
      required: true,
      index:true,
    },
    key: { 
      type:String,
      required: false,
    },
    type: {
      type: String,
      required: false,
      index:true,
    }
  },
  { timestamps: true },
);

DownloadSchema.index({ account_id: 1, file:1 }, { unique: true })
const DownloadModel = mongoose.model('Download', DownloadSchema, 'download');

export default DownloadModel;
