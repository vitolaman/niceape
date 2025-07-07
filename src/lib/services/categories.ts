export interface Category {
  id: string;
  name: string;
}

interface CategoriesResponse {
  page: number;
  limit: number;
  total_page: number;
  data: Category[];
}

/**
 * Fetch categories from the external API
 */
export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(
      'https://d1-nice-api.vito99varianlaman.workers.dev/api/categories?page=1&limit=1000000'
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CategoriesResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}
