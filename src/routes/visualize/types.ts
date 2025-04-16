import type { Tag } from '$lib/tag';

export type TaggedCounts = Record<string, Record<string, TaggedWordCounts>>;
export type TaggedWordCounts = {
	word: string;
	counts: Record<Tag, number>;
	total: number;
};
