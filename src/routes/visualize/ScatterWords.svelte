<script lang="ts">
	import Chart from 'chart.js/auto';

	import linku from './linku.json';
	import type { TaggedWordCounts } from './types';
	import { percent } from './utils';
	import Toggle from './Toggle.svelte';

	const {
		words,
		query
	}: {
		words: Record<string, TaggedWordCounts>;
		query: string;
	} = $props();

	const goodWords = new Set(
		Object.values(linku)
			.filter(
				(w) =>
					w.usage_category === 'core' ||
					w.usage_category === 'common' ||
					w.usage_category === 'uncommon'
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
	let denominator = $state<Denominator>('c');

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

	const values = $derived.by(() => {
		const shownWords: TaggedWordCounts[] = [];

		for (const word of Object.values(words)) {
			if (!goodWords.has(word.word)) continue;

			// if (word.counts.preposition === 0) continue;

			const contentCount =
				word.counts.noun +
				word.counts.tverb +
				word.counts.iverb +
				word.counts.modifier;

			if (contentCount === 0) continue;
			shownWords.push(word);
		}

		return shownWords.map((word) => {
			const contentCount =
				word.counts.noun +
				word.counts.tverb +
				word.counts.iverb +
				word.counts.modifier;
			let denom = contentCount;
			if (denominator === 'v') {
				denom = word.counts.tverb + word.counts.iverb;
			} else if (denominator === 'c-mod') {
				denom = contentCount - word.counts.modifier;
			} else if (denominator === 'total') {
				denom = word.total;
			}
			const value = {
				n: word.counts.noun / denom,
				iv: word.counts.iverb / denom,
				tv: word.counts.tverb / denom,
				m: word.counts.modifier / denom,
				v: (word.counts.tverb + word.counts.iverb) / denom,
				prep: word.counts.preposition / denom
			};

			return {
				label: word.word,
				x: value[axes.x as 'n'],
				y: value[axes.y as 'n'],
				highlighted: query.split(' ').includes(word.word)
			};
		});
	});

	const maxX = $derived.by(() => {
		const x = Math.max(...values.map((value) => value.x));
		return Math.ceil(x * 10) / 10;
	});
	const maxY = $derived.by(() => {
		const y = Math.max(...values.map((value) => value.y));
		return Math.ceil(y * 10) / 10;
	});
	const columns = $derived(maxX * 10);
	const rows = $derived(maxY * 10);
</script>

{#each ['x', 'y'] as const as direction}
	<p class="mt-2 flex gap-1">
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
{/each}

<p class="mt-2 flex gap-1">
	{#each denominators as d}
		<Toggle
			active={denominator === d}
			onclick={() => {
				denominator = d;
			}}
		>
			{d}
		</Toggle>
	{/each}
</p>

<div class="mt-4">
	<h1
		class="mx-auto max-w-[30ch] text-center text-xs font-semibold leading-tight text-gray-800"
	>
		{axesNames[axes.x]} and{' '}
		{axesNames[axes.y]} count over {denominatorNames[denominator]} count,
		<i>ma pona pi toki pona</i>, 2024
	</h1>

	<div class="flex w-full items-center">
		<div class="w-6">
			<p
				class="text-center text-xs text-gray-800"
				style:writing-mode="sideways-lr"
			>
				{axesNames[axes.y]} count / {denominatorNames[denominator]} count
			</p>
		</div>

		<div class="relative w-full p-2 pb-5 pl-6">
			<div
				class="relative grid aspect-square w-full"
				style:grid-template-columns="repeat({columns}, minmax(0, 1fr))"
			>
				{#each values as value}
					<div
						class="absolute -translate-x-1/2 translate-y-1/2 text-[8px]
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
						class="absolute left-0 -translate-x-full translate-y-1/2 pr-2 text-[8px] text-gray-500"
						style:bottom="{i * (100 / rows)}%"
					>
						{(i * 0.1).toFixed(1)}
					</div>
				{/each}
				{#each { length: columns + 1 } as _, i}
					<div
						class="absolute top-full -translate-x-1/2 pt-1 text-[8px] text-gray-500"
						style:left="{i * (100 / columns)}%"
					>
						{(i * 0.1).toFixed(1)}
					</div>
				{/each}
			</div>
		</div>
	</div>

	<div class="flex">
		<div class="mr-6 w-6"></div>

		<div class="w-full text-center">
			<p class="text-center text-xs text-gray-800">
				{axesNames[axes.x]} count / {denominatorNames[denominator]} count
			</p>
		</div>
	</div>
</div>
