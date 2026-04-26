import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  type: string;
  action: string;
  date: string;
  points: string;
  txHash?: string;
}

const TransactionSchema = new Schema({
  type: { type: String, required: true },
  action: { type: String, required: true },
  date: { type: String, required: true },
  points: { type: String, required: true },
  txHash: { type: String }
});

export const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);
