import { Document } from 'mongoose';
import { Role } from 'src/common/guards/role/role.enum';

export interface User extends Document {
    readonly email: string;
    readonly password: string;
    readonly role: Role;
    readonly domain: string;
    readonly user_id: string;
    readonly is_deleted: boolean;
    readonly is_active: boolean;
}
