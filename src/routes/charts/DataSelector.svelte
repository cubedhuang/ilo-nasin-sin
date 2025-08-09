<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { TaggedCounts, TaggedWordCounts } from './types';
	import Toggle from './Toggle.svelte';
	import type { Tag } from '$lib/tag';

	let {
		children,
		pokiData,
		discordData,
		output = $bindable(),
		dataName = $bindable()
	}: {
		children: Snippet;
		pokiData: TaggedCounts;
		discordData: TaggedCounts;
		output: Record<string, TaggedWordCounts>;
		dataName: string;
	} = $props();

	const datasetOptions = [
		{ label: 'poki Lapo', value: 'poki' },
		{ label: 'ma pona pi toki pona', value: 'discord' },
		{ label: 'both', value: 'both' }
	] as const;

	const yearOptions = [
		'2020',
		'2021',
		'2022',
		'2023',
		'2024',
		'all'
	] as const;

	type Dataset = (typeof datasetOptions)[number]['value'];
	type Year = (typeof yearOptions)[number];

	let dataset = $state<Dataset>('both');
	let year = $state<Year>('2024');

	function mergeData(
		a: Record<string, TaggedWordCounts>,
		b: Record<string, TaggedWordCounts>
	) {
		a = structuredClone(a);
		for (const [word, wordData] of Object.entries(b)) {
			if (a[word]) {
				for (const [tag, count] of Object.entries(wordData.counts)) {
					if (a[word].counts[tag as Tag]) {
						a[word].counts[tag as Tag] += count;
					} else {
						a[word].counts[tag as Tag] = count;
					}
				}
			} else {
				a[word] = wordData;
			}
		}
		return a;
	}

	function mergeSets(a: TaggedCounts, b: TaggedCounts): TaggedCounts {
		const merged: TaggedCounts = {};
		for (const year of yearOptions) {
			if (year === 'all') continue;

			merged[year] = mergeData(a[year], b[year]);
		}
		return merged;
	}

	function getAllYears(data: TaggedCounts): Record<string, TaggedWordCounts> {
		let output: Record<string, TaggedWordCounts> = {};
		for (const year of Object.keys(data)) {
			if (year === 'all') continue;
			output = mergeData(output, data[year]);
		}
		return output;
	}

	function updateOutput() {
		let set = pokiData;
		if (dataset === 'discord') {
			set = discordData;
		} else if (dataset === 'both') {
			set = mergeSets(pokiData, discordData);
		}

		if (year !== 'all') {
			output = set[year];
		} else {
			output = getAllYears(set);
		}

		if (dataset === 'poki') {
			dataName = 'poki Lapo';
		} else if (dataset === 'discord') {
			dataName = 'ma pona pi toki pona';
		} else {
			dataName = 'All data';
		}
		if (year !== 'all') {
			dataName += `, ${year}`;
		} else {
			dataName += ', all years';
		}
	}

	updateOutput();
</script>

<div>
	<h2 class="mt-4 text-lg font-semibold">{@render children()}</h2>

	<div class="mt-2 flex gap-1">
		{#each datasetOptions as option}
			<Toggle
				active={dataset === option.value}
				onclick={() => {
					dataset = option.value;
					updateOutput();
				}}
			>
				{option.label}
			</Toggle>
		{/each}
	</div>

	<div class="mt-2 flex gap-1">
		{#each yearOptions as option}
			<Toggle
				active={year === option}
				onclick={() => {
					year = option;
					updateOutput();
				}}
			>
				{option}
			</Toggle>
		{/each}
	</div>
</div>
