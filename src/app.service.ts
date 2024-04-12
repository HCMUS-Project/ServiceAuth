import { Inject, Injectable } from '@nestjs/common';
import Logger, { LoggerKey } from './core/logger/interfaces/logger.interface';
import { GrpcNotFoundException, GrpcUnknownException } from 'nestjs-grpc-exceptions';

@Injectable()
export class AppService {
    constructor(@Inject(LoggerKey) private logger: Logger) {}

    findOne(data: { id: number }): { id: number; name: string } {
        this.logger.error('findOne called');
        throw new GrpcNotFoundException('User Not Found.');
    }
}
