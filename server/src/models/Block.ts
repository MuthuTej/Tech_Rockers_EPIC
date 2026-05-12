import mongoose, { Schema, Document } from 'mongoose';

export interface IStageHistory {
  stage: string;
  timestamp: string;
  actor: string;
}

export interface IBlock extends Document {
  id: string; // E.g., BLK001
  name: string;
  type: string;
  techNode: string;
  complexity: string;
  estHours: number;
  actualHours: number;
  area: string;
  assignedTo: string | null;
  stage: string;
  description: string;
  createdAt: string;
  rejectionComment?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  stageHistory: IStageHistory[];
}

const StageHistorySchema = new Schema<IStageHistory>({
  stage: { type: String, required: true },
  timestamp: { type: String, required: true },
  actor: { type: String, required: true },
}, { _id: false });

const BlockSchema = new Schema<IBlock>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  techNode: { type: String, required: true },
  complexity: { type: String, required: true },
  estHours: { type: Number, required: true },
  actualHours: { type: Number, required: true },
  area: { type: String, required: true },
  assignedTo: { type: String, default: null },
  stage: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: String, required: true },
  rejectionComment: { type: String },
  rejectedBy: { type: String },
  rejectedAt: { type: String },
  stageHistory: [StageHistorySchema],
});

export const Block = mongoose.model<IBlock>('Block', BlockSchema);
