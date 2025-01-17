@preprocessor typescript

@{%
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
%}

@lexer lexer

Main -> Vocative {% id %}
Main -> Sentence {% id %}
Main -> Vocative Main {% makeBranch("main") %}

Vocative -> GeneralSubject WordVocativeMarker {% makeBranch("vocative") %}

Sentence -> Clause<any> {% id %}
Sentence -> Context Sentence {% makeBranch("clause") %}

Context -> GeneralSubject La {% makeBranch("context: phrase") %}
Context -> Clause<strict> La {% makeBranch("context: clause") %}

### Clauses

# S {any/strict} is whether or not a predicate is required
Clause<any> -> GeneralSubject {% id %}
Clause<P> -> MarkedSubject Predicates<li> {% makeBranch("clause: marked subject") %}
Clause<P> -> UnmarkedSubject Predicates<none> {% makeBranch("clause: unmarked subject") %}
Clause<P> -> GeneralSubject Predicates<o> {% makeBranch("clause: optative") %}
Clause<P> -> Predicates<o> {% makeLabelled("clause: imperative") %}

GeneralSubject -> MarkedSubject {% id %}
GeneralSubject -> UnmarkedSubject {% id %}

MarkedSubject -> WordMarkedSubjectHead {% makeLabelled("subject") %}
MarkedSubject -> PiPhrase<multiple> {% makeLabelled("subject") %}
MarkedSubject -> MultipleSubjects<none> {% id %}

# M {none/marked} is whether or not the subject is preceeded by "en"
MultipleSubjects<none> -> (Phrase {% makeLabelled("subject") %}) MultipleSubjects<marked> {% makeRoseFromBranch("& subjects") %}
MultipleSubjects<marked> -> EnSubject {% id %}
MultipleSubjects<marked> -> EnSubject MultipleSubjects<marked> {% makeRoseFromBranch("& subjects") %}
EnSubject -> En Phrase {% makeBranch("subject") %}

UnmarkedSubject -> WordUnmarkedSubject {% makeLabelled("subject") %}

# M {none/li/o/marked} is what the predicate can be marked with
Predicates<M> -> Predicate<M> {% id %}
Predicates<M> -> Predicate<M> Predicates<marked> {% makeRoseFromBranch("& predicates") %}

Predicate<li> -> WordIndicativeMarker PreverbPhrase {% makeBranch("predicate") %}
Predicate<o> -> WordDeonticMarker PreverbPhrase {% makeBranch("predicate") %}
Predicate<marked> -> WordPredicateMarker PreverbPhrase {% makeBranch("predicate") %}
Predicate<none> -> PreverbPhrase {% makeLabelled("predicate") %}

### Predicates

PreverbPhrase -> Preverb PreverbPhrase {% makeBranch("preverb") %}
PreverbPhrase -> Pred {% id %}

Preverb -> WordPreverb {% id %}

# T {tr/intr/prep} is the type of predicate
Pred -> PredTransitive {% id %}
Pred -> PredIntransitive {% id %}
Pred -> PredPrepositional {% id %}

PredTransitive -> Phrase Objects {% makeBranch("transitive") %}
PredIntransitive -> Phrase {% makeLabelled("intransitive") %}
PredIntransitive -> Phrase Prepositions {% makeBranch("intransitive") %}
PredPrepositional -> PrepositionPhrase {% makeLabelled("prepositional") %}
PredPrepositional -> PrepositionPhrase Prepositions {% makeBranch("prepositional") %}

Objects -> ObjectPhrase:+ {% makeRoseOptional("& objects") %}
ObjectPhrase -> Object {% makeLabelled("object") %}
ObjectPhrase -> Object Prepositions {% makeBranch("object") %}
Object -> E Phrase {% makeBranch("e") %}

Prepositions -> PrepositionPhrase:+ {% makeRoseOptional("& prepositions") %}
PrepositionPhrase -> Preposition Phrase {% makeBranch("preposition") %}

Preposition -> WordPreposition {% id %}

### Phrases

Phrase -> PiPhrase<any> {% id %}

# M {any/multiple} is whether or not some modifier is required
PiPhrase<M> -> NanpaPhrase<M> {% id %}
PiPhrase<M> -> PiPhrase<any> PiModifier {% makeBranch("phrase") %}

PiModifier -> Pi PiPhrase<multiple> {% makeBranch("pi") %}

NanpaPhrase<M> -> SimplePhrase<M> {% id %}
NanpaPhrase<M> -> NanpaPhrase<any> Ordinal {% makeBranch("phrase") %}

Ordinal -> Nanpa Number {% makeBranch("ordinal") %}

SimplePhrase<M> -> SimplePhrase<any> WordModifier {% makeBranch("phrase") %}
SimplePhrase<any> -> WordHead {% id %}

Number -> WordNumber:+ {% makeRose("number") %}
WordNumber -> %word_number {% makeLeaf("#") %}

### Words

A -> "a" {% makeLeaf("emph") %}
E -> "e" {% makeLeaf("obj") %}
Pi -> "pi" {% makeLeaf("regroup") %}
Nanpa -> "nanpa" {% makeLeaf("ord") %}
La -> "la" {% makeLeaf("ctx") %}
En -> "en" {% makeLeaf("conj") %}

WordPredicateMarker -> WordIndicativeMarker {% id %}
WordPredicateMarker -> WordDeonticMarker {% id %}

WordIndicativeMarker -> "li" {% makeLeaf("ind") %}

WordDeonticMarker -> "o" {% makeLeaf("deo") %}
WordVocativeMarker -> "o" {% makeLeaf("voc") %}

WordHead -> %word_content {% makeLeaf() %}
WordHead -> %word_preposition {% makeLeaf() %}
WordHead -> %word_preverb {% makeLeaf() %}
WordHead -> %word_number {% makeLeaf() %}
WordHead -> %word_unmarked_subject {% makeLeaf() %}
WordMarkedSubjectHead -> %word_content {% makeLeaf() %}
WordMarkedSubjectHead -> %word_preposition {% makeLeaf() %}
WordMarkedSubjectHead -> %word_preverb {% makeLeaf() %}
WordMarkedSubjectHead -> %word_number {% makeLeaf() %}
WordUnmarkedSubject -> %word_unmarked_subject {% makeLeaf() %}
WordModifier -> %word_modifier_only {% makeLeaf() %}
WordModifier -> A {% id %}
WordModifier -> WordHead {% id %}
WordPreverb -> %word_preverb {% makeLeaf("pv") %}
WordPreposition -> %word_preposition {% makeLeaf("prep") %}
