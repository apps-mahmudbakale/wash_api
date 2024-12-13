import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { CarWashersService } from './car-washers.service';
import { CreateCarWasherDto } from './dto/create-car-washer.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('car-washers')
export class CarWashersController {
  constructor(private readonly carWashersService: CarWashersService) {}

  @Post('create')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'passportPhotoFilename', maxCount: 1 },
      { name: 'idDocumentFilename', maxCount: 1 },
    ]),
  )
  async create(
    @Body() createCarWasherDto: CreateCarWasherDto,
    @UploadedFiles()
    files: {
      passportPhotoFilename?: Express.Multer.File[];
      idDocumentFilename?: Express.Multer.File[];
    },
  ) {
    // Convert files to Base64
    const passportPhotoBase64 = files?.passportPhotoFilename?.[0]?.buffer
      ? files.passportPhotoFilename[0].buffer.toString('base64')
      : null;

    const idDocumentBase64 = files?.idDocumentFilename?.[0]?.buffer
      ? files.idDocumentFilename[0].buffer.toString('base64')
      : null;

    // Add Base64 data to DTO
    createCarWasherDto.passportPhotoFilename = passportPhotoBase64;
    createCarWasherDto.idDocumentFilename = idDocumentBase64;

    const washer =
      await this.carWashersService.createCarWasher(createCarWasherDto);
    return { message: 'Car washer created successfully', washer };
  }

  @Get()
  findAll() {
    return this.carWashersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.carWashersService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateData: Partial<CreateCarWasherDto>,
  ) {
    return this.carWashersService.updateCarWasher(id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.carWashersService.removeCarWasher(id);
  }
}
