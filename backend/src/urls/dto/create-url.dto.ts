import { Url } from './url.dto';
import { PickType } from '@nestjs/swagger';

export class CreateUrlDto extends PickType(Url, ['url']) {}
