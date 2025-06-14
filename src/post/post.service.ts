import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from './schema/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private readonly model: Model<Post>) { }

  /* ---------- Create ---------- */
  async createPost(dto: CreatePostDto) {
    try {
      const post = new this.model({
        ...dto,
        author: new Types.ObjectId(dto.author),
      });
      return await post.save();
    } catch (err) {
      throw new InternalServerErrorException('Failed to create post');
    }
  }

  /* ---------- Read All ---------- */
  async findAllPosts() {
    try {
      return await this.model.find().populate('author', 'name');
    } catch (err) {
      throw new InternalServerErrorException('Failed to get posts');
    }
  }

  /* ---------- Read One ---------- */
  async findOnePost(id: string) {
    try {
      const post = await this.model.findById(id).populate('author', 'name');
      if (!post) throw new NotFoundException('Post not found');
      return post;
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException('Failed to get post');
    }
  }

  /* ---------- Update ---------- */
  async updatePost(id: string, dto: UpdatePostDto) {
    try {
      const updated = await this.model.findByIdAndUpdate(id, dto, {
        new: true,
      });
      if (!updated) throw new NotFoundException('Post not found');
      return updated;
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException('Failed to update post');
    }
  }

  /* ---------- Delete ---------- */
  async removePost(id: string) {
    try {
      const res = await this.model.deleteOne({ _id: id });
      if (res.deletedCount === 0) throw new NotFoundException('Post not found');
      return { message: 'Post deleted successfully' };
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException('Failed to delete post');
    }
  }
}
