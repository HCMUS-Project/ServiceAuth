import { Module } from '@nestjs/common';
import { Sign_inService } from './sign_in.service';
import { Sign_inController } from './sign_in.controller';
import {UserSchema} from "../../../models/user/schemas/user.schema";
// @ts-ignore
import {MongooseModule} from "@nestjs/mongoose";

@Module({
  imports: [MongooseModule.forFeature([{ name: "user", schema: UserSchema }])],
  controllers: [Sign_inController],
  providers: [Sign_inService],
})
export class Sign_inModule {}
