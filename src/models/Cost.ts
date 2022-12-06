import mongoose, { Document, Schema } from 'mongoose';

export interface Cost {
    name: string;
    added: Date;
    brutto: number;
    netto: number;
}

export interface CostModel extends Cost, Document {}

const CostSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        added: { type: Date, required: true },
        brutto: { type: Number, required: true },
        netto: { type: Number, required: true }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.model<CostModel>('Cost', CostSchema);
