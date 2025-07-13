import { createDb } from '../db';
import { users, insertUserSchema } from '../db/schema';
import { eq } from 'drizzle-orm';
import { Env } from '../types';
import { mapUserToResponse } from '../lib/field-mapping';
import {
  createTimestamps,
  updateTimestamps,
  deleteTimestamps,
  excludeDeleted,
  activeWithCondition,
} from '../lib/timestamps';

export class UserService {
  private db;

  constructor(env: Env) {
    this.db = createDb(env.DB);
  }

  async createUser(userData: {
    id: string;
    displayName?: string;
    bio?: string;
    walletAddress?: string;
    xHandle?: string;
    totalTrade?: number;
    volumeTrade?: number;
    charityImpact?: number;
  }) {
    const userWithTimestamps = {
      ...userData,
      ...createTimestamps(),
    };

    const newUser = insertUserSchema.parse(userWithTimestamps);
    const result = await this.db.insert(users).values(newUser).returning();
    return mapUserToResponse(result[0]);
  }

  async getUserByWallet(walletAddress: string) {
    const user = await this.db
      .select()
      .from(users)
      .where(activeWithCondition(users.deletedAt, eq(users.walletAddress, walletAddress)))
      .limit(1);

    return user[0] ? mapUserToResponse(user[0]) : null;
  }

  async getUserById(id: string) {
    const user = await this.db
      .select()
      .from(users)
      .where(activeWithCondition(users.deletedAt, eq(users.id, id)))
      .limit(1);

    return user[0] ? mapUserToResponse(user[0]) : null;
  }

  async updateUser(
    id: string,
    updateData: Partial<{
      displayName: string;
      bio: string;
      walletAddress: string;
      xHandle: string;
      totalTrade: number;
      volumeTrade: number;
      charityImpact: number;
    }>
  ) {
    const dataWithTimestamps = {
      ...updateData,
      ...updateTimestamps(),
    };

    const result = await this.db
      .update(users)
      .set(dataWithTimestamps)
      .where(activeWithCondition(users.deletedAt, eq(users.id, id)))
      .returning();

    return mapUserToResponse(result[0]);
  }

  async softDeleteUser(id: string) {
    const result = await this.db
      .update(users)
      .set(deleteTimestamps())
      .where(activeWithCondition(users.deletedAt, eq(users.id, id)))
      .returning();

    return mapUserToResponse(result[0]);
  }

  async getAllUsers() {
    const allUsers = await this.db.select().from(users).where(excludeDeleted(users.deletedAt));
    return allUsers.map(mapUserToResponse);
  }
}
