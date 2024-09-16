import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MessagesService } from './messages.service';
import { Message } from '../schema/message.schema';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  //@UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body('content') content: string,
    @Body('senderId') senderId: string,
    @Body('recipientId') recipientId: string,
    @Body('departmentId') departmentId: string,
    @Body('headerId') headerId: string,
    @Body('fileId') fileId: string,
  ): Promise<Message> {
    return this.messagesService.create(
      content,
      senderId,
      recipientId,
      departmentId === '0' ? null : departmentId,
      headerId,
      fileId === '0' ? null : fileId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Message[]> {
    return this.messagesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-header')
  async getHeadersByUserId(
    @Query('headerId') headerId: string,
  ): Promise<Message[]> {
    return this.messagesService.findMessagesByHeaderId(headerId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Message> {
    return this.messagesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body('content') content: string,
  ): Promise<Message> {
    return this.messagesService.update(id, content);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.messagesService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('header/:headerId')
  async deleteMessages(@Param('headerId') headerId: string) {
    return this.messagesService.deleteMessagesByHeader(headerId);
  }
}
