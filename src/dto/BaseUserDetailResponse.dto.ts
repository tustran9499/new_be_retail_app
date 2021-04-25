import { Exclude } from 'class-transformer';
import { VERIFIED_STATUS } from '../entities/enums/verifiedStatus.enum';
import { USER_STATUS } from '../entities/enums/userStatus.enum';

export class BaseUserDetailResponse {
  id: number;
  updatedAt: Date;
  createdAt: Date;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  verifiedStatus: VERIFIED_STATUS;
  status: USER_STATUS;

  @Exclude()
  password: string;

  @Exclude()
  session: string;
}
