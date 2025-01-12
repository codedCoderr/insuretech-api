import { Module } from '@nestjs/common';
import { ResponseService } from './response.service';
import { UtilService } from './util.service';

@Module({
  providers: [ResponseService, UtilService],
  exports: [ResponseService],
})
export class UtilModule {}
