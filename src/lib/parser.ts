import nearley from 'nearley';

import grammar from './grammar';
import type { Tree } from './types';

export function parse(text: string) {
	const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar)).feed(text);

	// const results = sortResults(addPolarQuestions(parser.results as Result[]));

	return parser.results as Tree[];
}
