import type { Token } from './lex';

export const labels = [
	'main',
	'vocative',
	'clause',
	'context_phrase',
	'context_clause',
	'clause_marked_subject',
	'clause_unmarked_subject',
	'clause_optative',
	'clause_imperative',
	'subject',
	'& subjects',
	'predicate',
	'& predicates',
	'preverb_phrase',
	'verb_phrase_transitive',
	'verb_phrase_intransitive',
	'verb_phrase_prepositional',
	'object_phrase',
	'e',
	'& objects',
	'preposition_phrase',
	'preposition',
	'& prepositions',
	'option',
	'& disjuncts',
	'phrase',
	'pi',
	'ordinal',
	'number',
	'head',
	// WORD TYPES
	'#',
	'emph',
	'obj',
	'regroup',
	'ord',
	'ctx',
	'conj',
	'neg',
	'or',
	'ind',
	'deo',
	'voc',
	'pv',
	'prep',
	''
] as const;

const labelSet = new Set(labels);
function isLabel(x: string): x is Label {
	return labelSet.has(x as Label);
}

function validateLabel(x: string): Label {
	if (!isLabel(x)) {
		throw new Error(`Invalid label: ${x}`);
	}
	return x;
}

type Label = (typeof labels)[number];

export interface Word {
	index: number | undefined;
	text: string;
}

interface TreeBase {
	/**
	 * The syntactic label of this node.
	 */
	label: Label;
	/**
	 * An index correlating a binding site with the structure it binds.
	 */
	binding?: number;
	/**
	 * A letter correlating an overt verbal argument with the PROs in a serial
	 * verb.
	 */
	coindex?: string;
	/**
	 * The source text for this subtree. This is always "surface Toaq" even if the tree represents a deep structure.
	 */
	source: string;
}

export interface Leaf extends TreeBase {
	type: 'leaf';
	word: Word;
	aux?: Tree;
}

export interface Branch<T> extends TreeBase {
	type: 'branch';
	left: T;
	right: T;
}

export interface BranchRightOptional<T> extends TreeBase {
	type: 'branchRightOptional';
	left: T;
	right?: T;
}

export interface Labelled<T> extends TreeBase {
	type: 'labelled';
	tree: T;
}

export interface Conjunct<T> extends TreeBase {
	type: 'conjunct';
	left: T;
	conjunct: T;
	right: T;
}

export interface Rose<T> extends TreeBase {
	type: 'rose';
	children: T[];
}

export type Tree =
	| Leaf
	| Branch<Tree>
	| BranchRightOptional<Tree>
	| Labelled<Tree>
	| Conjunct<Tree>
	| Rose<Tree>;

export function catSource(...args: (Tree | string | undefined | null)[]) {
	return args
		.map((x) => (typeof x === 'string' ? x : x ? x.source : undefined))
		.filter((x) => x)
		.join(' ');
}

export function makeWord([token]: [Token]): Word {
	return {
		index: token.index,
		text: token.value
	};
}

export function makeLeaf(label: Label = ''): (tokens: [Token, Tree]) => Leaf {
	validateLabel(label);
	return ([token, aux]: [Token, Tree | undefined]) => ({
		type: 'leaf',
		word: makeWord([token]),
		aux,
		label,
		source: token.value
	});
}

export function makeLabelled(label: Label): (tree: [Tree, Tree | undefined]) => Labelled<Tree> {
	validateLabel(label);
	return ([tree, aux]: [Tree, Tree | undefined]) => ({
		type: 'labelled',
		tree,
		aux,
		label,
		source: tree.source
	});
}

export function makeBranch(label: Label): (trees: [Tree, Tree]) => Branch<Tree> {
	validateLabel(label);
	return ([left, right]: [Tree, Tree]) => {
		return {
			type: 'branch',
			left,
			right,
			label,
			source: catSource(left, right)
		};
	};
}

export function makeBranchRightOptional(
	label: Label
): (trees: [Tree, Tree | undefined]) => BranchRightOptional<Tree> {
	validateLabel(label);
	return ([left, right]: [Tree, Tree | undefined]) => {
		return {
			type: 'branchRightOptional',
			left,
			right,
			label,
			source: catSource(left, right)
		};
	};
}

export function makeRose(label: Label): (children: [Tree[]]) => Rose<Tree> {
	validateLabel(label);
	return ([children]: [Tree[]]) => {
		return {
			type: 'rose',
			children,
			label,
			source: catSource(...children)
		};
	};
}

export function makeRoseOptional(label: Label): (children: [Tree[]]) => Tree {
	validateLabel(label);
	return ([children]: [Tree[]]) => {
		if (children.length === 1) {
			return children[0];
		}
		return {
			type: 'rose',
			children,
			label,
			source: catSource(...children)
		};
	};
}

export function makeRoseFromBranch(label: Label): (trees: [Tree, Tree]) => Rose<Tree> {
	validateLabel(label);
	return ([left, right]: [Tree, Tree]) => {
		if (right.type === 'rose') {
			return {
				type: 'rose',
				children: [left, ...right.children],
				label,
				source: catSource(left, right)
			};
		}

		return {
			type: 'rose',
			children: [left, right],
			label,
			source: catSource(left, right)
		};
	};
}

export function makeConjunct(label: Label): (trees: [Tree, Tree, Tree]) => Conjunct<Tree> {
	validateLabel(label);
	return ([left, conjunct, right]: [Tree, Tree, Tree]) => {
		return {
			type: 'conjunct',
			left,
			conjunct,
			right,
			label,
			source: catSource(left, conjunct, right)
		};
	};
}
