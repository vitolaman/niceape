import { workerApi } from '@/lib/worker-api';

export interface Category {
  id: string;
  name: string;
}

/**
 * Fetch categories from the worker API
 */
export async function fetchCategories(): Promise<Category[]> {
  try {
    const data = await workerApi.getCategories();
    return data as Category[];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}
