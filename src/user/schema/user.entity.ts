import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class User extends Document {
    @Prop({ unique: true })
    declare id: number

    @Prop({ required: true })
    name: string;

    @Prop()
    password: string;

    @Prop({ type: Types.ObjectId, ref: 'Post' })
    post: Types.ObjectId;

}

export const UserSchema = SchemaFactory.createForClass(User);
