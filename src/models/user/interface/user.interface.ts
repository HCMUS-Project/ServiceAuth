import { Document } from 'mongoose';
import { Role } from 'src/common/enums/role.enum';
import { Profile } from './profile.interface';

export interface User extends Document {
    readonly email: string;
    readonly password: string;
    readonly role: Role;
    readonly domain: string;
    readonly is_deleted: boolean;
    readonly is_active: boolean;
    readonly profile_id: Profile | string;
}
