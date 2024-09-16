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
import { HeadersService } from './headers.service';
import { Header } from '../schema/header.schema';

@Controller('headers')
export class HeadersController {
  constructor(private readonly headersService: HeadersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body('content') content: string,
    @Body('senderId') senderId: string,
    @Body('recipientId') recipientId: string,
    @Body('departmentId') departmentId: string,
    @Body('userId') userId: string,
  ): Promise<Header> {
    return this.headersService.create(
      content,
      senderId,
      recipientId,
      departmentId === '0' ? null : departmentId,
      userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Header[]> {
    return this.headersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('new-user')
  async getExistHeadersByUserId(
    @Query('userId') userId: string,
    @Query('otherId') otherId: string,
  ): Promise<Header[]> {
    return this.headersService.findExistHeadersByUserId(userId, otherId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-sender')
  async getHeaderBySender(
    @Query('userId') userId: string,
    @Query('otherId') otherId: string,
  ): Promise<Header> {
    return this.headersService.findHeaderBySender(userId, otherId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-recipient')
  async getHeaderByRecipient(
    @Query('userId') userId: string,
    @Query('otherId') otherId: string,
  ): Promise<Header> {
    return this.headersService.findHeaderByRecipient(userId, otherId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-user')
  async getHeadersByUserId(@Query('userId') userId: string): Promise<Header[]> {
    return this.headersService.findHeadersByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-group')
  async getHeadersByDepartmentId(
    @Query('departmentId') departmentId: string,
  ): Promise<Header[]> {
    return this.headersService.findHeadersByDepartmentId(departmentId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Header> {
    return this.headersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body('content') content: string,
    @Body('senderId') senderId: string,
    @Body('recipientId') recipientId: string,
  ): Promise<Header> {
    return this.headersService.update(id, content, senderId, recipientId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.headersService.remove(id);
  }
}
