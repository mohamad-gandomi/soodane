import { Category, Product } from '@/types/product';

// Selecting a parent also includes products assigned to any of its descendants.
export function matchesProductCategories(product: Product, selected: string[], categories: Category[]): boolean {
  if (selected.length === 0) return true;
  const wanted = new Set(selected);
  if (product.categories?.some(key => wanted.has(key))) return true;
  const byId = new Map(categories.map(category => [category.id, category]));
  let id = product.categoryId || product.category?.id;
  const visited = new Set<string>();
  if (product.category?.slug && wanted.has(product.category.slug)) return true;
  while (id && !visited.has(id)) {
    visited.add(id);
    const category = byId.get(id);
    if (wanted.has(id) || (category && wanted.has(category.slug))) return true;
    id = category?.parentId || undefined;
  }
  return false;
}
