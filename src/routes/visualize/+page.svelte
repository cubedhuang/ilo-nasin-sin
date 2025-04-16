<script lang="ts">
	import _pokiData from './taggedcounts.poki.json';
	import _discordData from './taggedcounts.json';
	import { tags, type Tag } from '$lib/tag';
	import { slide } from 'svelte/transition';

	const pokiData = _pokiData as TaggedCounts;
	const discordData = _discordData as TaggedCounts;

	type TaggedCounts = Record<string, Record<string, TaggedWordCounts>>;
	type TaggedWordCounts = {
		word: string;
		counts: Record<Tag, number>;
		total: number;
	};

	const years = $state(
		[2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017].map((year) => ({
			year,
			open: year === 2024
		}))
	);

	let method = $state<'union' | 'intersection'>('union');

	const tagNames: Record<Tag, string> = {
		noun: 'noun',
		tverb: 'tverb',
		iverb: 'iverb',
		modifier: 'mod',
		particle: 'part',
		preposition: 'prep',
		preverb: 'pv',
		interjection_head: 'intj'
	};

	const COLUMNS = [
		'total',
		...tags,
		'cnt',
		'noun/c',
		'iverb/c',
		'tverb/c',
		'mod/c'
	] as const;
	type Column = (typeof COLUMNS)[number];

	function getColumnName(col: Column) {
		if (col in tagNames) {
			return tagNames[col as Tag];
		}
		return col;
	}

	const columns = $state(
		COLUMNS.map((col) => ({
			col,
			active:
				col === 'noun' ||
				col === 'tverb' ||
				col === 'iverb' ||
				col === 'modifier'
		}))
	);
	const activeColumns = $derived(columns.filter((column) => column.active));

	function percent(value: number, total: number) {
		return ((value / total) * 100).toFixed(1) + '%';
	}

	function getColumnValue(
		word: TaggedWordCounts,
		col: Column
	): string | number | undefined {
		if (col in tagNames) {
			if (word.counts[col as Tag] === 0) return undefined;
			return percent(word.counts[col as Tag], word.total);
		}

		const contentCount =
			word.counts.noun +
			word.counts.tverb +
			word.counts.iverb +
			word.counts.modifier;

		if (col === 'cnt') {
			return contentCount;
		}

		if (col.endsWith('/c')) {
			if (contentCount === 0) return undefined;

			let baseCol = col.slice(0, -2);
			if (baseCol === 'mod') baseCol = 'modifier';

			if (word.counts[baseCol as Tag] === 0) return undefined;
			return percent(word.counts[baseCol as Tag], contentCount);
		}

		switch (col) {
			case 'total':
				return word.total;
			default:
				return undefined;
		}
	}

	let query = $state('');
	let exact = $state(true);

	function filterWords(words: string[]) {
		if (!query) return words;

		const queries = query
			.split(' ')
			.map((q) => q.trim())
			.filter(Boolean);
		if (queries.length === 0) return words;

		return words.filter((word) =>
			queries.some((q) => {
				if (exact) {
					return word === q;
				}

				const lq = q.toLowerCase();
				return (
					word.includes(lq) ||
					word.startsWith(lq) ||
					word.endsWith(lq)
				);
			})
		);
	}
</script>

<svelte:head>
	<title>o lukin e poki</title>
</svelte:head>

<h1 class="text-3xl font-bold">o lukin e poki</h1>

<p class="mt-2 text-gray-500">
	Compare words between the <i>ma pona pi toki pona</i> and <i>poki Lapo</i> corpora.
</p>

{#snippet toggle(text: string, active: boolean, onclick: () => void)}
	<button
		class="rounded border px-2 py-1 text-sm font-semibold transition {active
			? 'border-gray-800 bg-gray-800 text-gray-200 hover:bg-gray-700'
			: 'text-gray-500 hover:bg-gray-50'}"
		{onclick}
	>
		{text}
	</button>
{/snippet}

<p class="mt-2 flex gap-1">
	{#each columns as column}
		{@render toggle(
			getColumnName(column.col),
			column.active,
			() => (column.active = !column.active)
		)}
	{/each}
</p>

<p class="mt-2">
	<button
		class="rounded border bg-gray-50 px-2 py-1 text-sm font-semibold text-gray-800 transition hover:bg-gray-100"
		onclick={() => (method = method === 'union' ? 'intersection' : 'union')}
	>
		{method === 'union' ? 'union' : 'intersection'}
	</button>
</p>

<p class="mt-2 flex gap-1">
	<input
		type="text"
		class="rounded border px-2 py-1 text-sm outline-offset-4"
		bind:value={query}
		placeholder="o alasa..."
	/>

	{@render toggle('exact', exact, () => (exact = !exact))}
</p>

{#each years as { year, open }, i}
	{@const pokiWords = pokiData[year]}
	{@const discordWords = discordData[year]}
	{@const words = filterWords(
		[
			...new Set(Object.keys(pokiWords))[method](
				new Set(Object.keys(discordWords))
			)
		].sort()
	)}

	<div class="mt-4 flex items-baseline gap-2">
		<h2 class="text-2xl font-semibold">
			{year}
		</h2>
		<button
			class="text-xs text-gray-500 hover:text-black"
			onclick={() => (years[i].open = !years[i].open)}
		>
			{open ? 'hide' : 'show'}
		</button>
	</div>

	{#if open}
		<div class="mt-2 flex flex-col" transition:slide>
			<div class="sticky top-0">
				<div
					class="flex w-max items-baseline border-y bg-white font-semibold"
				>
					<p class="w-28">Source</p>
					<p class="self-stretch border-l"></p>
					{#each activeColumns as { col }, i (col)}
						<p class="entry whitespace-nowrap pl-2 !text-left">
							{#if i === 0}
								<i>ma pona pi toki pona</i>
							{/if}
						</p>
					{/each}
					<p class="self-stretch border-l"></p>
					{#each activeColumns as { col }, i (col)}
						<p class="entry whitespace-nowrap pl-2 !text-left">
							{#if i === 0}
								<i>poki Lapo</i>
							{/if}
						</p>
					{/each}
				</div>
				<div
					class="flex w-max items-baseline border-b bg-white font-semibold"
				>
					<p class="w-28">Word</p>

					<p class="self-stretch border-l"></p>
					{#each activeColumns as { col } (col)}
						<p class="entry">
							{getColumnName(col)}
						</p>
					{/each}

					<p class="self-stretch border-l"></p>
					{#each activeColumns as { col } (col)}
						<p class="entry">
							{getColumnName(col)}
						</p>
					{/each}
				</div>
			</div>
			{#each words as word}
				{@const discordWord = discordWords[word]}
				{@const pokiWord = pokiWords[word]}

				{#snippet columns(word: TaggedWordCounts)}
					<p class="self-stretch border-l"></p>
					{#each activeColumns as { col } (col)}
						<p class="entry">
							<!-- {#if word && word.counts[col] !== 0}
								{percent(word.counts[col], word.total)}
							{/if} -->
							{#if word}
								{getColumnValue(word, col)}
							{/if}
						</p>
					{/each}
				{/snippet}

				<div class="flex w-max items-baseline border-b">
					<p class="w-28">{word}</p>

					{@render columns(discordWord)}
					{@render columns(pokiWord)}
				</div>
			{/each}
		</div>
	{/if}
{/each}

<style lang="postcss">
	.entry {
		@apply w-20 py-1 pr-2 text-right;
	}
</style>
