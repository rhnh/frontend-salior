import type { Taxonomy } from "@prisma/client";

export type TaxonomyAndId = Taxonomy & { _id: { ob: string } };
