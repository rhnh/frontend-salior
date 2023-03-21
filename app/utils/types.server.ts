import type { List, Post, Taxonomy } from "@prisma/client";

export type TaxonomyAndId = Taxonomy & { _id: { $oid: string } };
export type PostWithId = Post & { _id: { $oid: string } };
export type ListWithId = {
  _id: { $oid: string },
  birds: TaxonomyAndId[], id: string
  username: string
  listname: string
  createdAt: Date
  updatedAt: Date
}

export type TaxonomyList = List & {
  birds: Taxonomy[]
}

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



export type SaliorState = "PENDING" | 'IDLE' | 'SUCCESS' | "FAILED" | "ERROR"
export interface SaliorResponse {
  state: SaliorState;
  message?: string,
  error?: string
}