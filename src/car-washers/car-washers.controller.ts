import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CarWashersService } from './car-washers.service';
import { CreateCarWasherDto } from './dto/create-car-washer.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('car-washers')
export class CarWashersController {
  constructor(private readonly carWasherService: CarWashersService) {}

  // Creating a car washer with file uploads for KYC and profile picture
  @Post('create')
  @UseInterceptors(
    FileInterceptor('profilePicture', {
      storage: diskStorage({
        destination: './uploads/profile-pictures',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            file.fieldname +
              '-' +
              uniqueSuffix +
              '.' +
              file.mimetype.split('/')[1],
          );
        },
      }),
    }),
  )
  async create(
    @Body() createCarWasherDto: CreateCarWasherDto,
    @UploadedFile() profilePicture: Express.Multer.File,
  ) {
    const washer = await this.carWasherService.createCarWasher(
      createCarWasherDto,
      profilePicture,
    );
    return {
      message: 'Car washer created successfully',
      washer,
    };
  }

  @Get()
  findAll() {
    return this.carWasherService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.carWasherService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateData: Partial<CreateCarWasherDto>,
  ) {
    return this.carWasherService.updateCarWasher(id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.carWasherService.removeCarWasher(id);
  }

  @Put('verify-kyc/:id')
  verifyKYC(@Param('id') id: number) {
    return this.carWasherService.verifyKYC(id);
  }

  // Upload KYC document
  @Post('upload-kyc-document')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/kyc-documents',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            file.fieldname +
              '-' +
              uniqueSuffix +
              '.' +
              file.mimetype.split('/')[1],
          );
        },
      }),
    }),
  )
  uploadKYCDocument(@UploadedFile() file: Express.Multer.File) {
    return {
      message: 'KYC document uploaded successfully',
      filePath: `/uploads/kyc-documents/${file.filename}`,
    };
  }
}
