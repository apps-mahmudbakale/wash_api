import { IsNotEmpty, IsEmail, IsNumber } from 'class-validator';

export class CreateCarWasherDto {
  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  phone: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  idDocumentType: string;

  @IsNotEmpty()
  idDocumentFilename: string;

  @IsNotEmpty()
  passportPhotoFilename: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsNotEmpty()
  guarantor1Name: string;

  @IsNotEmpty()
  guarantor1Phone: string;

  @IsNotEmpty()
  guarantor1Address: string;

  @IsNotEmpty()
  guarantor2Name: string;

  @IsNotEmpty()
  guarantor2Phone: string;

  @IsNotEmpty()
  guarantor2Address: string;
}
