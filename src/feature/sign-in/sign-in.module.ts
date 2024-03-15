import { Module } from '@nestjs/common';
import { SignInService } from './sign-in.service';
import { SignInController } from './sign-in.controller';
import {UserSchema} from "../../models/user/schemas/user.schema";
// @ts-ignore
import {MongooseModule} from "@nestjs/mongoose";

@Module({
  imports: [MongooseModule.forFeature([{ name: "user", schema: UserSchema }])],
  controllers: [SignInController],
  providers: [SignInService],
})
export class SignInModule {}
