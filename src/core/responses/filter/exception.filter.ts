import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        console.log('exception', exception);
        
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        console.log(exception);
        const errorResponse = {
            statusCode: status,
            message:
                exception instanceof HttpException
                    ? (exception.getResponse() as { message: string }).message
                    : 'Internal Server Error',
            error:
                exception instanceof HttpException
                    ? (exception.getResponse() as { error: string }).error
                    : 'Internal Server Error',
            timestamp: new Date().toISOString(),
            data: {},
        };

        ctx.getResponse().status(status).send(errorResponse);
    }
}
