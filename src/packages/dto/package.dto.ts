// src/packages/dto/create-package.dto.ts
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreatePackageDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  numberOfWashes: number;
}
