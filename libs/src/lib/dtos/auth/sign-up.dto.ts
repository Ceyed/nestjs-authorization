import { GLOBAL_EXCEPT_DTO } from '@libs/constants/global-except.constant';
import { UserEntity } from '@libs/entities/user/user.entity';
import { OmitType } from '@nestjs/swagger';

export class SignUpDto extends OmitType(UserEntity, [...GLOBAL_EXCEPT_DTO] as const) {}
