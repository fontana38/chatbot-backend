import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMenuOptionDto {
  @IsString()
  @IsNotEmpty()
  option: string;

  @IsString()
  @IsNotEmpty()
  label: string;

  @IsString()
  @IsNotEmpty()
  targetType: string;

  @IsString()
  @IsNotEmpty()
  targetValue: string;
}

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  welcomeMessage: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateMenuOptionDto)
  options: CreateMenuOptionDto[];
}