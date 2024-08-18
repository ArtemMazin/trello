import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema({
  timestamps: true,
  toObject: {
    // Преобразование _id в строку, иначе при вызове plainToClass _id меняет значение
    transform: (doc, ret) => {
      ret._id = ret._id.toString();
      return ret;
    },
  },
})
export class Card extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Column', required: true })
  columnId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  order: number;
}

export const CardSchema = SchemaFactory.createForClass(Card);
