import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Department } from '../schema/department.schema';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Department.name) private departmentModel: Model<Department>,
  ) {}

  // Create a new department
  async create(departmentname: string): Promise<Department> {
    const newDepartment = new this.departmentModel({ departmentname });
    return newDepartment.save();
  }

  // Retrieve all departments
  async findAll(): Promise<Department[]> {
    return this.departmentModel.find().exec();
  }

  // Retrieve a single department by ID
  async findOne(id: string): Promise<Department> {
    const department = await this.departmentModel.findById(id).exec();
    if (!department) {
      throw new NotFoundException(`Department with ID "${id}" not found`);
    }
    return department;
  }

  // Update a department by ID
  async update(id: string, departmentname: string): Promise<Department> {
    const updatedDepartment = await this.departmentModel
      .findByIdAndUpdate(
        id,
        { departmentname },
        { new: true }, // Return the updated document
      )
      .exec();
    if (!updatedDepartment) {
      throw new NotFoundException(`Department with ID "${id}" not found`);
    }
    return updatedDepartment;
  }

  // Update a department photo by ID
  async updatePhoto(id: string, photoUrl: string): Promise<Department> {
    const updatedDepartment = await this.departmentModel
      .findByIdAndUpdate(
        id,
        { photo: photoUrl },
        { new: true, runValidators: true },
      )
      .exec();

    if (!updatedDepartment) {
      throw new NotFoundException(`Department with ID "${id}" not found`);
    }

    return updatedDepartment;
  }

  // Update a department members by ID
  async addMember(departmentId: string, member: string): Promise<Department> {
    const department = await this.departmentModel.findById(departmentId).exec();

    if (!department) {
      throw new NotFoundException(
        `Department with ID "${departmentId}" not found`,
      );
    }

    department.members.push(member);
    return department.save();
  }

  // Remove a department by ID
  async remove(id: string): Promise<void> {
    const result = await this.departmentModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Department with ID "${id}" not found`);
    }
  }
}
