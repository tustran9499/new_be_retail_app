import { BaseUserDetailResponse } from '../BaseUserDetailResponse.dto';

export class LoginResponseDto extends BaseUserDetailResponse {
  token: string;

  constructor(partial: Partial<LoginResponseDto>) {
    super();
    Object.assign(this, partial);
  }
}
