import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Card extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Column', required: true })
  columnId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;
}

export const CardSchema = SchemaFactory.createForClass(Card);
