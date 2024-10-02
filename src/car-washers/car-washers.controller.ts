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

  @Post('create')
  create(@Body() createCarWasherDto: CreateCarWasherDto) {
    return this.carWasherService.createCarWasher(createCarWasherDto);
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
  update(@Param('id') id: number, @Body() updateData: Partial<CreateCarWasherDto>) {
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

  // Profile picture upload
  @Post('upload-profile-picture')
  @UseInterceptors(
    FileInterceptor('file', {
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
  uploadProfilePicture(@UploadedFile() file: Express.Multer.File) {
    return {
      message: 'Profile picture uploaded successfully',
      filePath: `/uploads/profile-pictures/${file.filename}`,
    };
  }

  // KYC document upload (e.g., BVN, NIN)
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
