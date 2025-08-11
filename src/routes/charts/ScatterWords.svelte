<script lang="ts">
	import Chart from 'chart.js/auto';

	import linku from '$lib/linku.json';
	import type { TaggedWordCounts } from './types';
	import { percent } from '../visualize/utils';
	import Toggle from './Toggle.svelte';

	const {
		words,
		query,
		dataName
	}: {
		words: Record<string, TaggedWordCounts>;
		query: string;
		dataName: string;
	} = $props();

	const goodWords = new Set(
		Object.values(linku)
			.filter(
				(w) =>
					w.usage_category === 'core' || w.usage_category === 'common'
			)
			.map((w) => w.word)
	);

	const axisOptions = [
		{ label: 'noun', value: 'n' },
		{ label: 'iverb', value: 'iv' },
		{ label: 'tverb', value: 'tv' },
		{ label: 'modifier', value: 'm' },
		{ label: 'verb', value: 'v' },
		{ label: 'prep', value: 'prep' }
	] as const;
	type Axis = (typeof axisOptions)[number]['value'];
	const axes = $state<{ x: Axis; y: Axis }>({
		x: 'n',
		y: 'v'
	});
	const denominators = ['total', 'c', 'v', 'c-mod'] as const;
	type Denominator = (typeof denominators)[number];

	let currentDenoms = $state<{ x: Denominator; y: Denominator }>({
		x: 'c',
		y: 'c'
	});

	const axesNames: Record<Axis, string> = {
		n: 'Noun',
		iv: 'IVerb',
		tv: 'TVerb',
		m: 'Mod',
		v: 'Verb',
		prep: 'Prep'
	};
	const denominatorNames: Record<Denominator, string> = {
		total: 'Total',
		c: 'Content',
		v: 'Verb',
		'c-mod': '(Content - Mod)'
	};

	function getDenom(word: TaggedWordCounts, d: Denominator): number {
		const contentCount =
			word.counts.noun +
			word.counts.tverb +
			word.counts.iverb +
			word.counts.modifier;

		if (d === 'v') {
			return word.counts.tverb + word.counts.iverb;
		} else if (d === 'c-mod') {
			return contentCount - word.counts.modifier;
		} else if (d === 'total') {
			return word.total;
		}
		return contentCount;
	}

	const values = $derived.by(() => {
		const shownWords: TaggedWordCounts[] = [];

		for (const word of Object.values(words)) {
			if (!goodWords.has(word.word)) continue;

			if (getDenom(word, currentDenoms.x) === 0) continue;
			if (getDenom(word, currentDenoms.y) === 0) continue;

			shownWords.push(word);
		}

		return shownWords.map((word) => {
			const value = {
				n: word.counts.noun,
				iv: word.counts.iverb,
				tv: word.counts.tverb,
				m: word.counts.modifier,
				v: word.counts.tverb + word.counts.iverb,
				prep: word.counts.preposition
			};

			return {
				label: word.word,
				x: value[axes.x as 'n'] / getDenom(word, currentDenoms.x),
				y: value[axes.y as 'n'] / getDenom(word, currentDenoms.y),
				highlighted: query.split(' ').includes(word.word)
			};
		});
	});

	function toIncrement(num: number): number {
		const val = Math.pow(10, Math.floor(Math.log10(num)));
		if (num / val < 2) return val / 5;
		return val;
	}

	const maxX = $derived.by(() => {
		const x = Math.max(...values.map((value) => value.x));
		return Math.ceil(x * 10) / 10;
	});
	const maxY = $derived.by(() => {
		const y = Math.max(...values.map((value) => value.y));
		return Math.ceil(y * 10) / 10;
	});
	const xIncrement = $derived(toIncrement(maxX));
	const yIncrement = $derived(toIncrement(maxY));
	const columns = $derived(Math.ceil(maxX / xIncrement));
	const rows = $derived(Math.ceil(maxY / yIncrement));
</script>

{#each ['x', 'y'] as const as direction}
	<p class="mt-2 flex items-baseline gap-1">
		<span class="w-16 text-sm font-semibold">{direction}-axis</span>
		{#each axisOptions as axis}
			<Toggle
				active={axes[direction] === axis.value}
				onclick={() => {
					axes[direction] = axis.value;
				}}
			>
				{axis.label}
			</Toggle>
		{/each}
	</p>
	<p class="mt-2 flex items-baseline gap-1">
		<span class="w-16 text-sm font-semibold">{direction} denom</span>
		{#each denominators as d}
			<Toggle
				active={currentDenoms[direction] === d}
				onclick={() => {
					currentDenoms[direction] = d;
				}}
			>
				{d}
			</Toggle>
		{/each}
	</p>
{/each}

<div class="mt-4">
	<div class="mx-auto text-center font-semibold leading-tight text-gray-800">
		<h2>
			{axesNames[axes.x]} / {denominatorNames[currentDenoms.x]}
			vs
			{axesNames[axes.y]} / {denominatorNames[currentDenoms.y]}
		</h2>
		<p>{dataName}</p>
	</div>

	<div class="flex w-full items-center">
		<div class="w-6">
			<p
				class="text-center text-sm text-gray-800"
				style:writing-mode="sideways-lr"
			>
				{axesNames[axes.y]} / {denominatorNames[currentDenoms.y]}
			</p>
		</div>

		<div class="relative w-full p-2 pb-5 pl-6">
			<div
				class="relative grid aspect-square w-full"
				style:grid-template-columns="repeat({columns}, minmax(0, 1fr))"
			>
				{#each values as value}
					<div
						class="absolute -translate-x-1/2 translate-y-1/2 text-xs
							{value.highlighted
							? 'z-20 border border-blue-200 bg-blue-100 px-0.5 text-blue-950'
							: 'text-gray-500'}"
						style:left="{(value.x * 100) / maxX}%"
						style:bottom="{(value.y * 100) / maxY}%"
					>
						{value.label}
					</div>
				{/each}

				{#each { length: rows } as _, i}
					{#each { length: columns } as _, j}
						<div
							class="border-b border-r"
							class:border-t={i === 0}
							class:border-l={j === 0}
						></div>
					{/each}
				{/each}

				{#each { length: rows + 1 } as _, i}
					<div
						class="absolute left-0 -translate-x-full translate-y-1/2 pr-2 text-[10px] text-gray-500"
						style:bottom="{i * (100 / rows)}%"
					>
						{(i * yIncrement).toFixed(1)}
					</div>
				{/each}
				{#each { length: columns + 1 } as _, i}
					<div
						class="absolute top-full -translate-x-1/2 pt-1 text-[10px] text-gray-500"
						style:left="{i * (100 / columns)}%"
					>
						{(i * xIncrement).toFixed(1)}
					</div>
				{/each}
			</div>
		</div>
	</div>

	<div class="flex">
		<div class="mr-6 w-6"></div>

		<div class="w-full text-center">
			<p class="text-center text-sm text-gray-800">
				{axesNames[axes.x]} / {denominatorNames[currentDenoms.x]}
			</p>
		</div>
	</div>
</div>
