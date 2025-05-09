import type { Label, Tree, Word } from './types';

export const tags = [
	'noun',
	'tverb',
	'iverb',
	'modifier',
	'particle',
	'preposition',
	'preverb',
	'interjection_head'
] as const;

export type Tag = (typeof tags)[number];

export interface TaggedWord {
	word: Word;
	tag: Tag;
}

const sContexts = ['interjection', 'noun', 'iverbal', 'tverbal'] as const;
type SContext = (typeof sContexts)[number];

const nContexts = ['head', 'modifier'] as const;
type NContext = (typeof nContexts)[number];

export function tagWords(
	tree: Tree,
	sContext: SContext = 'interjection',
	nContext: NContext = 'modifier'
): TaggedWord[] {
	if (tree.label.startsWith('clause') || tree.label === 'object_phrase') {
		sContext = 'noun';
	} else if (tree.label === 'verb_phrase_transitive') {
		sContext = 'tverbal';
	} else if (
		tree.label === 'verb_phrase_intransitive' ||
		tree.label === 'verb_phrase_prepositional'
	) {
		sContext = 'iverbal';
	}

	if (tree.label === 'head') {
		nContext = 'head';
	}

	switch (tree.type) {
		case 'branch':
			return [
				...tagWords(tree.left, sContext, nContext),
				...tagWords(tree.right, sContext, nContext)
			];
		case 'labelled':
			return tagWords(tree.tree, sContext, nContext);
		case 'rose':
			return tree.children.flatMap((t) =>
				tagWords(t, sContext, nContext)
			);
		case 'leaf':
			return [
				{
					word: tree.word,
					tag: determineTag(tree.label, sContext, nContext)
				}
			];
		default:
			throw new Error('unreachable');
	}
}

function determineTag(
	label: Label,
	sContext: SContext,
	nContext: NContext
): Tag {
	switch (label) {
		case 'prep':
			return 'preposition';
		case 'pv':
			return 'preverb';
		case 'cont':
			if (nContext !== 'head') {
				return 'modifier';
			} else {
				return sContext === 'noun'
					? 'noun'
					: sContext === 'interjection'
						? 'interjection_head'
						: sContext === 'tverbal'
							? 'tverb'
							: 'iverb';
			}
		default:
			return 'particle';
	}
}
