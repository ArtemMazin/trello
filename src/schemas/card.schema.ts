import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
  @Prop({ type: String, ref: 'Column', required: true })
  columnId: string;

  @Prop({ type: String, ref: 'User', required: true })
  authorId: string;

  @Prop({ required: true, minlength: 1, maxlength: 100 })
  title: string;

  @Prop()
  description: string;

  @Prop()
  order: number;
}

export const CardSchema = SchemaFactory.createForClass(Card);
