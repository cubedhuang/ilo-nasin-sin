<script lang="ts">
	import _pokiData from '../visualize/taggedcounts.poki.json';
	import _discordData from '../visualize/taggedcounts.json';

	import ScatterWords from './ScatterWords.svelte';
	import type { TaggedCounts, TaggedWordCounts } from './types';
	import DataSelector from './DataSelector.svelte';

	const pokiData = _pokiData as TaggedCounts;
	const discordData = _discordData as TaggedCounts;

	let data1: Record<string, TaggedWordCounts> = $state(discordData[2024]);
	let data1Name = $state('ma pona pi toki pona, 2024');
	let data2: Record<string, TaggedWordCounts> = $state(pokiData[2024]);
	let data2Name = $state('poki Lapo, 2024');

	let query = $state('');
</script>

<svelte:head>
	<title>o kama e sitelen pona</title>
</svelte:head>

<h1 class="text-3xl font-bold">o kama e sitelen pona</h1>

<h2 class="mb-1 mt-4 text-lg font-semibold">o kule e nimi suli</h2>
<p>
	<input
		type="text"
		class="rounded border px-2 py-1 text-sm outline-offset-4"
		bind:value={query}
		placeholder="luka uta ..."
	/>
</p>

<div class="flex gap-4">
	<DataSelector
		{pokiData}
		{discordData}
		bind:output={data1}
		bind:dataName={data1Name}
	>
		Data 1
	</DataSelector>

	<DataSelector
		{pokiData}
		{discordData}
		bind:output={data2}
		bind:dataName={data2Name}
	>
		Data 2
	</DataSelector>
</div>

<hr class="my-6" />

<div class="mt-4 flex gap-6">
	<div class="w-full max-w-xl flex-1">
		<ScatterWords words={data1} {query} dataName={data1Name} />
	</div>
	<div class="w-full max-w-xl flex-1">
		<ScatterWords words={data2} {query} dataName={data2Name} />
	</div>
</div>
