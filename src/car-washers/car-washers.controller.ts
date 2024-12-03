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
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('car-washers')
export class CarWashersController {
  constructor(private readonly carWashersService: CarWashersService) {}

  @Post('create')
  @UseInterceptors(
    FilesInterceptor('files', 2, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const folder =
            file.fieldname === 'passportPhoto'
              ? './uploads/passport-photos'
              : './uploads/id-documents';
          cb(null, folder);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}.${file.mimetype.split('/')[1]}`,
          );
        },
      }),
    }),
  )
  async create(
    @Body() createCarWasherDto: CreateCarWasherDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const washer = await this.carWashersService.createCarWasher(
      createCarWasherDto,
      files,
    );
    return {
      message: 'Car washer created successfully',
      washer,
    };
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
