import { Env } from '../../types';
import { UserService } from '../users';
import { UserAuthDto } from './user-auth.dto';
import { UserAuthData } from './user-auth.interface';

export class UserAuthService {
  private userService: UserService;

  constructor(env: Env) {
    this.userService = new UserService(env);
  }

  async authenticateOrCreateUser(data: UserAuthDto): Promise<UserAuthData> {
    const { wallet_address } = data;

    // Check if user already exists
    let user = await this.userService.getUserByWallet(wallet_address);
    let isNewUser = false;

    if (!user) {
      // Create new user if doesn't exist
      const userId = crypto.randomUUID();
      user = await this.userService.createUser({
        id: userId,
        walletAddress: wallet_address,
        totalTrade: 0,
        volumeTrade: 0,
        charityImpact: 0,
      });
      isNewUser = true;
    }

    return {
      user,
      isNewUser,
      message: isNewUser ? 'User created successfully' : 'User authenticated successfully',
    };
  }
}
