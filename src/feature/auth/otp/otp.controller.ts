import {Body, Controller, Post} from "@nestjs/common";
import { OtpService } from "./otp.service";
import { otpDto } from "./dto/otp.dto";

@Controller('/api/auth')
export class OtpController {
    constructor(private readonly otpService: OtpService) {
    }

    @Post('send-otp')
    async sendOtpEmail(@Body() otpDto: otpDto): Promise<void> {
        return await this.otpService.sendOtpEmail(otpDto);
    }

    @Post('active-account')
    async activeAccount(@Body() otpDto: otpDto): Promise<boolean> {
        return await this.otpService.activeAccount(otpDto);
    }

    @Post('check-otp-valid')
    async checkOtpValid(@Body() otpDto: otpDto): Promise<boolean> {
        return await this.otpService.checkOtpValid(otpDto);
    }

    @Post('recover-password')
    async recoverPassword(@Body() otpDto: otpDto, new_password: string): Promise<boolean> {
        return await this.otpService.recoverPassword(otpDto, new_password);
    }
}