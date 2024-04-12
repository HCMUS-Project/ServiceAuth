import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AppService } from './app.service';
import { Hero } from './proto/main_pb';

@Controller()
export class AppController {
    constructor(private readonly heroService: AppService) {}

    @GrpcMethod('AppService')
    findOne(data: { id: number }) {
        return this.heroService.findOne(data);
    }
}
