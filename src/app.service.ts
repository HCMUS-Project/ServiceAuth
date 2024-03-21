import { Inject, Injectable } from '@nestjs/common';
import Logger, { LoggerKey } from './core/logger/interfaces/logger.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheStore } from '@nestjs/cache-manager';

@Injectable()
export class AppService {
    constructor(
        @Inject(LoggerKey) private logger: Logger,
        private configService: ConfigService<ConfigModule>,
        @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
    ) {}

    async getHello(): Promise<object> {
        await this.cacheManager.set('key', '22222', {ttl: 100} );

        const value = await this.cacheManager.get('key');
        this.logger.info('Cache', { props: { key: value } });
        
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
