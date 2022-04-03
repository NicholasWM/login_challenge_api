import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DeleteUserDTO {
  @IsNotEmpty({
    message: 'Informe o nome do usuario',
  })
  @ApiProperty({
    default: 1,
  })
  id: number;
}
