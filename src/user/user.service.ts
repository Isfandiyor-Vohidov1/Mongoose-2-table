import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.entity'
import { Model, Types } from 'mongoose';
import { Post } from 'src/post/schema/post.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private model: Model<User>) { }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const { id, name, password, postId } = createUserDto;
      const user = new this.model({
        id,
        name,
        password,
        post: new Types.ObjectId(postId)
      });

      if (user == user.id) {
        throw new ConflictException("User with this id alredy exists")
      }
      await user.save();
      return user;

    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async findAllUsers() {
    try {
      const users = await this.model.find().populate('post')
      return users;
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async findUserById(id: number) {
    try {
      const user = await this.model.findOne({ id })
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }


  async updateUserById(id: number, updateUserDto: UpdateUserDto) {
    try {
      const result = await this.model.updateOne({ id }, updateUserDto);
      if (result.matchedCount === 0) {
        throw new NotFoundException('User not found');
      }
      return { message: 'User updated successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async remove(id: number) {
    try {
      const result = await this.model.deleteOne({ id });
      if (!result) {
        throw new NotFoundException('User not found');
      }
      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
