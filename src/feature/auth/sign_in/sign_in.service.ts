import {Injectable, Inject, Request} from '@nestjs/common';
import {signInDto} from './dto/sign_in.dto';
import {User} from 'src/models/user/interfaces/user.interface';
import * as argon from 'argon2';
import {Model} from 'mongoose';
import {isHash, validateOrReject, ValidationError} from 'class-validator';
import
{
    UserNotFoundException,
    InvalidPasswordException,
    ValidationFailedException,
    UnActivatedUserException,
    BadRequestException,
} from '../../../common/exceptions/exceptions';
import Logger, {LoggerKey} from 'src/core/logger/interfaces/logger.interface';
import {TokenService} from '../token/token.service';
import {Backlog} from 'src/models/user/interfaces/backlog.interface';

@Injectable()
export class SignInService
{
    constructor (
        @Inject('USER_MODEL') private readonly User: Model<User>,
        @Inject(LoggerKey) private logger: Logger,
        private readonly tokenService: TokenService,
        @Inject('BACKLOG_MODEL') private readonly Backlog: Model<Backlog>,
    ) { }

    async signIn (_signInDto: signInDto, @Request() req): Promise<any>
    {
        try
        {
            // Validate sign in data
            const signInData = Object.assign(new signInDto(), _signInDto);
            await validateOrReject(signInData);

            // Check if user exists
        } catch (errors)
        {
            if (errors instanceof Array && errors[0] instanceof ValidationError)
            {
                const messages = errors.map(error => Object.values(error.constraints)).join(', ');
                throw new ValidationFailedException(`Validation failed: ${ messages }`);
            } else
            {
                throw new ValidationFailedException('Validation failed', errors.toString());
            }
        }

        const user = await this.User.findOne({email: _signInDto.email}).select('+password');

        if (!user)
        {
            this.logger.error('User not found for email: ' + _signInDto.email);
            throw new UserNotFoundException('User not found for email: ' + _signInDto.email);
        }
        if (user.is_active === false)
        {
            this.logger.error('User is not active: ' + _signInDto.email);
            throw new UnActivatedUserException('User is not active: ' + _signInDto.email);
        }

        const isPasswordMatch = await argon.verify(user.password, _signInDto.password);

        // Ch
        if (!isPasswordMatch)
        {
            this.logger.error('Invalid password for user: ' + user.email);
            throw new InvalidPasswordException('Invalid password for user: ' + user.email);
        }

        const tokens = await this.tokenService.getTokens(user.user_id, _signInDto.device);
        const update_tokens = await this.tokenService.updateRefreshToken(user.user_id, tokens.refreshToken, true);

        await this.addToBacklog(user.user_id, true, false, req);

        return {user, tokens};
    }

    async signOut (@Request() req)
    {
        try
        {
            const userId = req.user['user_id'];
            const update_token = await this.tokenService.updateRefreshToken(userId, null, false);

            await this.addToBacklog(userId, false, true, req);

            return {
                message: 'User successfully signed out',
                token: update_token,
            };
        } catch (error)
        {
            this.logger.error('Error while signing out', {error});
            throw new BadRequestException('Error while signing out', error.toString());
        }
    }

    async addToBacklog (userId: string, sign_In = false, sign_Out = false, @Request() req)
    {
        try
        {
            let description: any = {};

            // console.log(req);

            if (req)
            {
                description.status = sign_In ? 'sign_In' : 'sign_Out';
                description.app = req.app;
                description.baseUrl = req.baseUrl;
                description.body = req.body;
                description.cookies = req.cookies;
                description.fresh = req.fresh;
                description.hostname = req.hostname;
                description.ip = req.ip;
                description.ips = req.ips;
                description.method = req.method;
                description.originalUrl = req.originalUrl;
                description.params = req.params;
                description.path = req.path;
                description.protocol = req.protocol;
                description.query = req.query;
                description.res = req.res;
                description.route = req.route;
                description.secure = req.secure;
                description.signedCookies = req.signedCookies;
                description.stale = req.stale;
                description.subdomains = req.subdomains;
                description.xhr = req.xhr;
                description.headers = req.headers;
                description.hosts = req.hosts;
            }

            const user = await this.User.findOne({user_id: userId, });

            const backlogEntry = await this.Backlog.create({
                user_id: userId,
                description: description,
            });

            if (sign_In)
            {
                this.logger.info(`User ${ userId } signed in. Backlog entry created.`);
            } else if (sign_Out)
            {
                this.logger.info(`User ${ userId } signed out. Backlog entry created.`);
            }
        } catch (error)
        {
            this.logger.error('Error adding to backlog', {error});
            throw new BadRequestException('Error adding to backlog', error.toString());
        }
    }
}
