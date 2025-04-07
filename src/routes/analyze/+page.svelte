<script lang="ts">
	import { parse } from '$lib/parser';
	import { tagWords, type Tag, type TaggedWord } from '$lib/tag';
	import type { Tree } from '$lib/types';

	let text = $state(
		'sina ken ala toki pona e ijo la, sina sona ala e ijo. jan li pana e moku tawa sina. mi wile kama sona e nasin sin.'
	);

	function process(text: string) {
		const sentences = text
			.split(/\.|·|:|\?|!/g)
			.map((sentence) => sentence.trim())
			.filter((sentence) => sentence.length);
		const parses: Tree[] = [];
		const fails: string[] = [];

		for (const sentence of sentences) {
			try {
				const results = parse(sentence);
				parses.push(results[0].tree);
			} catch (e) {
				fails.push(sentence);
			}
		}

		return parses.map((tree) => tagWords(tree));
	}

	const parses = $derived(process(text));

	function aggregate(parses: TaggedWord[][]): Map<string, Map<Tag, number>> {
		const words = new Map<string, Map<Tag, number>>();

		for (const parse of parses) {
			for (const taggedWord of parse) {
				if (!words.has(taggedWord.word.text)) {
					words.set(taggedWord.word.text, new Map());
				}

				const map = words.get(taggedWord.word.text)!;
				map.set(taggedWord.tag, (map.get(taggedWord.tag) ?? 0) + 1);
			}
		}

		return new Map(
			[...words.entries()].sort((a, b) => a[0].localeCompare(b[0]))
		);
	}

	const data = $derived(aggregate(parses));
</script>

<svelte:head>
	<title>ilo pi sona mute</title>
</svelte:head>

<h1 class="text-3xl font-bold">sona mute</h1>

<textarea
	class="mt-4 w-full rounded-xl border-2 px-4 py-2 text-lg outline-none transition focus:border-gray-400"
	bind:value={text}
	placeholder="o toki pona..."
></textarea>

<!-- <pre class="mt-4 whitespace-pre-wrap">{JSON.stringify(parses, null, 2)}</pre> -->

{#each parses.slice(0, 5) as sentence}
	<div class="my-2 flex gap-1">
		{#each sentence as taggedWord}
			<div class="rounded-md border-2 p-1">
				<p class="text-sm">{taggedWord.word.text}</p>
				<p class="text-xs uppercase text-gray-500">{taggedWord.tag}</p>
			</div>
		{/each}
	</div>
{/each}

{#each data as [word, values]}
	<div class="flex items-baseline">
		<p class="w-20">
			{word}
		</p>

		{#each values as [tag, count]}
			<p class="ml-4 text-sm">{tag}</p>
			<p class="ml-1 text-xs uppercase text-gray-500">{count}</p>
		{/each}
	</div>
{/each}
