import mongoose, { Schema, Document } from 'mongoose';
export interface Merchantkey extends Pick<Document, '_id'> {
  keyname: string;
  uuid: string;
  secret_key: string;
  public_key: string;
  account_id: string;
}

const MerchantKeySchema: Schema<Merchantkey> = new Schema(
  {
    keyname: {
      type: String,
      required: false,
    },

    uuid: {
      type: String,
      required: false,
      index:true,
    },
    secret_key: {
      type: String,
      required: true,
      index:true,
    },
    public_key: { 
      type:String,
      required: true,
    },
    account_id: { 
      type:String,
      required: true,
      index:true
    },
  },
  { timestamps: true },
);

MerchantKeySchema.index({ account_id: 1, file:1 }, { unique: true })
const MerchantKeyModel = mongoose.model('Merchantkey', MerchantKeySchema, 'merchant_key');

export default MerchantKeyModel;
