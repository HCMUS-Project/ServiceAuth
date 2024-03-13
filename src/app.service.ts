import { Inject, Injectable } from '@nestjs/common';
import Logger, { LoggerKey } from './core/logger/interfaces/logger.interface';
import { BadRequestException } from './common/exceptions/exceptions';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
    constructor(
        @Inject(LoggerKey) private logger: Logger,
        private configService: ConfigService<ConfigModule>,
    ) {}

    getHello(): object {
        this.logger.startProfile('getHello');
        const port = this.configService.get<number>('port');
        this.logger.info('Port', { props: { port } });
        this.logger.info(
            'I am a debug message!',
            {
                props: {
                    foo: 'bar',
                    baz: 'qux',
                },
            },
            'getHello',
        );

        // throw new BadRequestException('Ngu');
        return {
            res: 'success',
        };
    }
}
