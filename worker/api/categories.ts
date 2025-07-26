import { createDb } from '../db';
import { masterCategories, insertMasterCategorySchema } from '../db/schema';
import { eq } from 'drizzle-orm';
import { Env } from '../types';
import { mapCategoryToResponse } from '../lib/field-mapping';
import {
  createTimestamps,
  updateTimestamps,
  deleteTimestamps,
  excludeDeleted,
  activeWithCondition,
} from '../lib/timestamps';

export class MasterCategoryService {
  private db;

  constructor(env: Env) {
    this.db = createDb(env.DB);
  }

  async createCategory(categoryData: { id?: string; name?: string }) {
    const categoryWithTimestamps = {
      ...categoryData,
      ...createTimestamps(),
    };

    const newCategory = insertMasterCategorySchema.parse(categoryWithTimestamps);
    const result = await this.db.insert(masterCategories).values(newCategory).returning();
    return mapCategoryToResponse(result[0]);
  }

  async getCategoryById(id: string) {
    const category = await this.db
      .select()
      .from(masterCategories)
      .where(activeWithCondition(masterCategories.deletedAt, eq(masterCategories.id, id)))
      .limit(1);

    return category[0] ? mapCategoryToResponse(category[0]) : null;
  }

  async getAllCategories() {
    const categories = await this.db
      .select()
      .from(masterCategories)
      .where(excludeDeleted(masterCategories.deletedAt));
    return categories.map(mapCategoryToResponse);
  }

  async updateCategory(
    id: string,
    updateData: Partial<{
      name: string;
    }>
  ) {
    const dataWithTimestamps = {
      ...updateData,
      ...updateTimestamps(),
    };

    const result = await this.db
      .update(masterCategories)
      .set(dataWithTimestamps)
      .where(activeWithCondition(masterCategories.deletedAt, eq(masterCategories.id, id)))
      .returning();

    return mapCategoryToResponse(result[0]);
  }

  async softDeleteCategory(id: string) {
    const result = await this.db
      .update(masterCategories)
      .set(deleteTimestamps())
      .where(activeWithCondition(masterCategories.deletedAt, eq(masterCategories.id, id)))
      .returning();

    return mapCategoryToResponse(result[0]);
  }

  async deleteCategory(id: string) {
    const result = await this.db
      .delete(masterCategories)
      .where(eq(masterCategories.id, id))
      .returning();

    return mapCategoryToResponse(result[0]);
  }
}
