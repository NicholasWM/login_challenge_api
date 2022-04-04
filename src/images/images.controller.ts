import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';

@ApiTags('images')
@Controller('images')
export class ImagesController {
  constructor(private userService: UserService) {}
  @ApiParam({ name: 'userId', type: 'number', required: true })
  @Get('/:userId')
  async getImage(@Param('userId') id, @Res() res) {
    const user = await this.userService.findById(id);
    const responseImage = res.sendFile(user.imageName, {
      root: `./uploads`,
    });
    return {
      status: HttpStatus.OK,
      data: responseImage,
    };
  }
}
