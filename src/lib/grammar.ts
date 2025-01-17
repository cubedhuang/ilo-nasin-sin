// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var word_number: any;
declare var word_content: any;
declare var word_preposition: any;
declare var word_preverb: any;
declare var word_unmarked_subject: any;
declare var word_modifier_only: any;

import {
	makeLeaf,
	makeBranch,
	makeLabelled,
	makeRose,
	makeRoseOptional,
	makeRoseFromBranch,
	makeConjunct,
} from "./tree";

import { TokiPonaLexer } from "./lex";

const lexer = new TokiPonaLexer();

interface NearleyToken {
  value: any;
  [key: string]: any;
};

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
};

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: lexer,
  ParserRules: [
    {"name": "Main", "symbols": ["Vocative"], "postprocess": id},
    {"name": "Main", "symbols": ["Sentence"], "postprocess": id},
    {"name": "Main", "symbols": ["Vocative", "Main"], "postprocess": makeBranch("main")},
    {"name": "Vocative", "symbols": ["GeneralSubject", "WordVocativeMarker"], "postprocess": makeBranch("vocative")},
    {"name": "Sentence", "symbols": ["Clause_any"], "postprocess": id},
    {"name": "Sentence", "symbols": ["Context", "Sentence"], "postprocess": makeBranch("clause")},
    {"name": "Context", "symbols": ["GeneralSubject", "La"], "postprocess": makeBranch("context: phrase")},
    {"name": "Context", "symbols": ["Clause_strict", "La"], "postprocess": makeBranch("context: clause")},
    {"name": "Clause_any", "symbols": ["GeneralSubject"], "postprocess": id},
    {"name": "Clause_any", "symbols": ["MarkedSubject", "Predicates_li"], "postprocess": makeBranch("clause: marked subject")},
    {"name": "Clause_strict", "symbols": ["MarkedSubject", "Predicates_li"], "postprocess": makeBranch("clause: marked subject")},
    {"name": "Clause_any", "symbols": ["UnmarkedSubject", "Predicates_none"], "postprocess": makeBranch("clause: unmarked subject")},
    {"name": "Clause_strict", "symbols": ["UnmarkedSubject", "Predicates_none"], "postprocess": makeBranch("clause: unmarked subject")},
    {"name": "Clause_any", "symbols": ["GeneralSubject", "Predicates_o"], "postprocess": makeBranch("clause: optative")},
    {"name": "Clause_strict", "symbols": ["GeneralSubject", "Predicates_o"], "postprocess": makeBranch("clause: optative")},
    {"name": "Clause_any", "symbols": ["Predicates_o"], "postprocess": makeLabelled("clause: imperative")},
    {"name": "Clause_strict", "symbols": ["Predicates_o"], "postprocess": makeLabelled("clause: imperative")},
    {"name": "GeneralSubject", "symbols": ["MarkedSubject"], "postprocess": id},
    {"name": "GeneralSubject", "symbols": ["UnmarkedSubject"], "postprocess": id},
    {"name": "MarkedSubject", "symbols": ["WordMarkedSubjectHead"], "postprocess": makeLabelled("subject")},
    {"name": "MarkedSubject", "symbols": ["PiPhrase_multiple"], "postprocess": makeLabelled("subject")},
    {"name": "MarkedSubject", "symbols": ["MultipleSubjects_none"], "postprocess": id},
    {"name": "MultipleSubjects_none$subexpression$1", "symbols": ["Phrase"], "postprocess": makeLabelled("subject")},
    {"name": "MultipleSubjects_none", "symbols": ["MultipleSubjects_none$subexpression$1", "MultipleSubjects_marked"], "postprocess": makeRoseFromBranch("& subjects")},
    {"name": "MultipleSubjects_marked", "symbols": ["EnSubject"], "postprocess": id},
    {"name": "MultipleSubjects_marked", "symbols": ["EnSubject", "MultipleSubjects_marked"], "postprocess": makeRoseFromBranch("& subjects")},
    {"name": "EnSubject", "symbols": ["En", "Phrase"], "postprocess": makeBranch("subject")},
    {"name": "UnmarkedSubject", "symbols": ["WordUnmarkedSubject"], "postprocess": makeLabelled("subject")},
    {"name": "Predicates_li", "symbols": ["Predicate_li"], "postprocess": id},
    {"name": "Predicates_none", "symbols": ["Predicate_none"], "postprocess": id},
    {"name": "Predicates_o", "symbols": ["Predicate_o"], "postprocess": id},
    {"name": "Predicates_marked", "symbols": ["Predicate_marked"], "postprocess": id},
    {"name": "Predicates_li", "symbols": ["Predicate_li", "Predicates_marked"], "postprocess": makeRoseFromBranch("& predicates")},
    {"name": "Predicates_none", "symbols": ["Predicate_none", "Predicates_marked"], "postprocess": makeRoseFromBranch("& predicates")},
    {"name": "Predicates_o", "symbols": ["Predicate_o", "Predicates_marked"], "postprocess": makeRoseFromBranch("& predicates")},
    {"name": "Predicates_marked", "symbols": ["Predicate_marked", "Predicates_marked"], "postprocess": makeRoseFromBranch("& predicates")},
    {"name": "Predicate_li", "symbols": ["WordIndicativeMarker", "PreverbPhrase"], "postprocess": makeBranch("predicate")},
    {"name": "Predicate_o", "symbols": ["WordDeonticMarker", "PreverbPhrase"], "postprocess": makeBranch("predicate")},
    {"name": "Predicate_marked", "symbols": ["WordPredicateMarker", "PreverbPhrase"], "postprocess": makeBranch("predicate")},
    {"name": "Predicate_none", "symbols": ["PreverbPhrase"], "postprocess": makeLabelled("predicate")},
    {"name": "PreverbPhrase", "symbols": ["Preverb", "PreverbPhrase"], "postprocess": makeBranch("preverb")},
    {"name": "PreverbPhrase", "symbols": ["Pred"], "postprocess": id},
    {"name": "Preverb", "symbols": ["WordPreverb"], "postprocess": id},
    {"name": "Pred", "symbols": ["PredTransitive"], "postprocess": id},
    {"name": "Pred", "symbols": ["PredIntransitive"], "postprocess": id},
    {"name": "Pred", "symbols": ["PredPrepositional"], "postprocess": id},
    {"name": "PredTransitive", "symbols": ["Phrase", "Objects"], "postprocess": makeBranch("transitive")},
    {"name": "PredIntransitive", "symbols": ["Phrase"], "postprocess": makeLabelled("intransitive")},
    {"name": "PredIntransitive", "symbols": ["Phrase", "Prepositions"], "postprocess": makeBranch("intransitive")},
    {"name": "PredPrepositional", "symbols": ["PrepositionPhrase"], "postprocess": makeLabelled("prepositional")},
    {"name": "PredPrepositional", "symbols": ["PrepositionPhrase", "Prepositions"], "postprocess": makeBranch("prepositional")},
    {"name": "Objects$ebnf$1", "symbols": ["ObjectPhrase"]},
    {"name": "Objects$ebnf$1", "symbols": ["Objects$ebnf$1", "ObjectPhrase"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "Objects", "symbols": ["Objects$ebnf$1"], "postprocess": makeRoseOptional("& objects")},
    {"name": "ObjectPhrase", "symbols": ["Object"], "postprocess": makeLabelled("object")},
    {"name": "ObjectPhrase", "symbols": ["Object", "Prepositions"], "postprocess": makeBranch("object")},
    {"name": "Object", "symbols": ["E", "Phrase"], "postprocess": makeBranch("e")},
    {"name": "Prepositions$ebnf$1", "symbols": ["PrepositionPhrase"]},
    {"name": "Prepositions$ebnf$1", "symbols": ["Prepositions$ebnf$1", "PrepositionPhrase"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "Prepositions", "symbols": ["Prepositions$ebnf$1"], "postprocess": makeRoseOptional("& prepositions")},
    {"name": "PrepositionPhrase", "symbols": ["Preposition", "Phrase"], "postprocess": makeBranch("preposition")},
    {"name": "Preposition", "symbols": ["WordPreposition"], "postprocess": id},
    {"name": "Phrase", "symbols": ["PiPhrase_any"], "postprocess": id},
    {"name": "PiPhrase_multiple", "symbols": ["NanpaPhrase_multiple"], "postprocess": id},
    {"name": "PiPhrase_any", "symbols": ["NanpaPhrase_any"], "postprocess": id},
    {"name": "PiPhrase_multiple", "symbols": ["PiPhrase_any", "PiModifier"], "postprocess": makeBranch("phrase")},
    {"name": "PiPhrase_any", "symbols": ["PiPhrase_any", "PiModifier"], "postprocess": makeBranch("phrase")},
    {"name": "PiModifier", "symbols": ["Pi", "PiPhrase_multiple"], "postprocess": makeBranch("pi")},
    {"name": "NanpaPhrase_multiple", "symbols": ["SimplePhrase_multiple"], "postprocess": id},
    {"name": "NanpaPhrase_any", "symbols": ["SimplePhrase_any"], "postprocess": id},
    {"name": "NanpaPhrase_multiple", "symbols": ["NanpaPhrase_any", "Ordinal"], "postprocess": makeBranch("phrase")},
    {"name": "NanpaPhrase_any", "symbols": ["NanpaPhrase_any", "Ordinal"], "postprocess": makeBranch("phrase")},
    {"name": "Ordinal", "symbols": ["Nanpa", "Number"], "postprocess": makeBranch("ordinal")},
    {"name": "SimplePhrase_multiple", "symbols": ["SimplePhrase_any", "WordModifier"], "postprocess": makeBranch("phrase")},
    {"name": "SimplePhrase_any", "symbols": ["SimplePhrase_any", "WordModifier"], "postprocess": makeBranch("phrase")},
    {"name": "SimplePhrase_any", "symbols": ["WordHead"], "postprocess": id},
    {"name": "Number$ebnf$1", "symbols": ["WordNumber"]},
    {"name": "Number$ebnf$1", "symbols": ["Number$ebnf$1", "WordNumber"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "Number", "symbols": ["Number$ebnf$1"], "postprocess": makeRose("number")},
    {"name": "WordNumber", "symbols": [(lexer.has("word_number") ? {type: "word_number"} : word_number)], "postprocess": makeLeaf("#")},
    {"name": "A", "symbols": [{"literal":"a"}], "postprocess": makeLeaf("emph")},
    {"name": "E", "symbols": [{"literal":"e"}], "postprocess": makeLeaf("obj")},
    {"name": "Pi", "symbols": [{"literal":"pi"}], "postprocess": makeLeaf("regroup")},
    {"name": "Nanpa", "symbols": [{"literal":"nanpa"}], "postprocess": makeLeaf("ord")},
    {"name": "La", "symbols": [{"literal":"la"}], "postprocess": makeLeaf("ctx")},
    {"name": "En", "symbols": [{"literal":"en"}], "postprocess": makeLeaf("conj")},
    {"name": "WordPredicateMarker", "symbols": ["WordIndicativeMarker"], "postprocess": id},
    {"name": "WordPredicateMarker", "symbols": ["WordDeonticMarker"], "postprocess": id},
    {"name": "WordIndicativeMarker", "symbols": [{"literal":"li"}], "postprocess": makeLeaf("ind")},
    {"name": "WordDeonticMarker", "symbols": [{"literal":"o"}], "postprocess": makeLeaf("deo")},
    {"name": "WordVocativeMarker", "symbols": [{"literal":"o"}], "postprocess": makeLeaf("voc")},
    {"name": "WordHead", "symbols": [(lexer.has("word_content") ? {type: "word_content"} : word_content)], "postprocess": makeLeaf()},
    {"name": "WordHead", "symbols": [(lexer.has("word_preposition") ? {type: "word_preposition"} : word_preposition)], "postprocess": makeLeaf()},
    {"name": "WordHead", "symbols": [(lexer.has("word_preverb") ? {type: "word_preverb"} : word_preverb)], "postprocess": makeLeaf()},
    {"name": "WordHead", "symbols": [(lexer.has("word_number") ? {type: "word_number"} : word_number)], "postprocess": makeLeaf()},
    {"name": "WordHead", "symbols": [(lexer.has("word_unmarked_subject") ? {type: "word_unmarked_subject"} : word_unmarked_subject)], "postprocess": makeLeaf()},
    {"name": "WordMarkedSubjectHead", "symbols": [(lexer.has("word_content") ? {type: "word_content"} : word_content)], "postprocess": makeLeaf()},
    {"name": "WordMarkedSubjectHead", "symbols": [(lexer.has("word_preposition") ? {type: "word_preposition"} : word_preposition)], "postprocess": makeLeaf()},
    {"name": "WordMarkedSubjectHead", "symbols": [(lexer.has("word_preverb") ? {type: "word_preverb"} : word_preverb)], "postprocess": makeLeaf()},
    {"name": "WordMarkedSubjectHead", "symbols": [(lexer.has("word_number") ? {type: "word_number"} : word_number)], "postprocess": makeLeaf()},
    {"name": "WordUnmarkedSubject", "symbols": [(lexer.has("word_unmarked_subject") ? {type: "word_unmarked_subject"} : word_unmarked_subject)], "postprocess": makeLeaf()},
    {"name": "WordModifier", "symbols": [(lexer.has("word_modifier_only") ? {type: "word_modifier_only"} : word_modifier_only)], "postprocess": makeLeaf()},
    {"name": "WordModifier", "symbols": ["A"], "postprocess": id},
    {"name": "WordModifier", "symbols": ["WordHead"], "postprocess": id},
    {"name": "WordPreverb", "symbols": [(lexer.has("word_preverb") ? {type: "word_preverb"} : word_preverb)], "postprocess": makeLeaf("pv")},
    {"name": "WordPreposition", "symbols": [(lexer.has("word_preposition") ? {type: "word_preposition"} : word_preposition)], "postprocess": makeLeaf("prep")}
  ],
  ParserStart: "Main",
};

export default grammar;
