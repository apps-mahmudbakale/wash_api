import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCarDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  userId: string; // Represents the user owning the car
}
