import { Module } from '@nestjs/common';
import { ApplicationSetupService } from './application-setup.service';

@Module({
    providers:[ApplicationSetupService],
})
export class ApplicationSetupModule {}
