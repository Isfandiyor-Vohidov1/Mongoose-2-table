import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://localhost:27017/n10000"),
    UserModule,
    PostModule
  ],
  // controllers: [],
  // providers: [],
})
export class AppModule { }
