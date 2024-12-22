import { IsNotEmpty, IsEmail, IsNumber, IsEmpty } from 'class-validator';


export class CreateCarWasherDto {
  @IsNotEmpty()
  fullName: string;

  @IsEmpty()
  address: string;

  @IsNotEmpty()
  phone: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsEmpty()
  idDocumentType: string;

  @IsEmpty()
  idDocumentFilename: string;

  @IsEmpty()
  passportPhotoFilename: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsEmpty()
  guarantor1Name: string;

  @IsEmpty()
  guarantor1Phone: string;

  @IsNotEmpty()
  guarantor1Address: string;

  @IsEmpty()
  guarantor2Name: string;

  @IsEmpty()
  guarantor2Phone: string;

  @IsEmpty()
  guarantor2Address: string;
}
