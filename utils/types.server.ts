import type { Post, Taxonomy } from "@prisma/client";

export type TaxonomyAndId = Taxonomy & { _id: { ob: string } };
export type PostWithId = Post & { _id: { ob: string } };


export interface Paginated {
  page: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginatedPosts extends Paginated {
  posts: PostWithId[]
  totalPosts: number;
}

export interface PaginatedBirds extends Paginated {
  birds: TaxonomyAndId[]
  totalBirds: number;
}