import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DepartmentsService } from './departments.service';
import { Department } from '../schema/department.schema';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body('departmentname') departmentname: string,
  ): Promise<Department> {
    return this.departmentsService.create(departmentname);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Department[]> {
    return this.departmentsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Department> {
    return this.departmentsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body('departmentname') departmentname: string,
  ): Promise<Department> {
    return this.departmentsService.update(id, departmentname);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/photo')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/photos', // Directory where the photos will be saved
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async updatePhoto(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    const photoUrl = file.filename;
    await this.departmentsService.updatePhoto(id, photoUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/members')
  async addMember(
    @Param('id') departmentId: string,
    @Body('member') member: string,
  ): Promise<Department> {
    return this.departmentsService.addMember(departmentId, member);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.departmentsService.remove(id);
  }
}
