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

	let canvas: HTMLCanvasElement;

	const axisOptions = [
		{ label: 'noun', value: 'n' },
		{ label: 'iverb', value: 'iv' },
		{ label: 'tverb', value: 'tv' },
		{ label: 'modifier', value: 'm' },
		{ label: 'verb', value: 'v' },
		{ label: 'prep', value: 'prep' }
	] as const;
	type Axis = (typeof axisOptions)[number]['value'];
	const axes = $state({
		x: 'n',
		y: 'v'
	});
	const denominators = ['total', 'c', 'v', 'c-mod'] as const;
	type Denominator = (typeof denominators)[number];
	let denominator = $state<Denominator>('c');

	$effect(() => {
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

		const chart = new Chart(canvas, {
			type: 'scatter',
			data: {
				datasets: shownWords.map((word) => {
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
						label: word.word,
						n: word.counts.noun / denom,
						iv: word.counts.iverb / denom,
						tv: word.counts.tverb / denom,
						m: word.counts.modifier / denom,
						v: (word.counts.tverb + word.counts.iverb) / denom,
						prep: word.counts.preposition / denom,
						x: 0,
						y: 0
					};
					value.x = value[axes.x as 'n'];
					value.y = value[axes.y as 'n'];

					return {
						xAxisID: axes.x,
						yAxisID: axes.y,
						data: [value],
						backgroundColor: query.split(' ').includes(word.word)
							? 'rgba(54, 162, 235, 1)'
							: 'rgba(255, 99, 132, 1)'
					};
				})
			},
			options: {
				transitions: {},
				plugins: {
					legend: {
						display: false
					},
					tooltip: {
						callbacks: {
							label(item) {
								const values = item.raw as Record<
									string,
									number
								>;

								const DISPLAYED: Record<Denominator, Axis[]> = {
									total: ['n', 'iv', 'tv', 'm', 'prep'],
									c: ['n', 'iv', 'tv', 'm'],
									v: ['iv', 'tv'],
									'c-mod': ['n', 'iv', 'tv']
								};

								const label = (
									item.raw as Record<string, string>
								).label;

								const displayed = DISPLAYED[denominator]
									.map((axis) => {
										const value = values[axis];
										if (value === undefined) return '';
										return percent(value) + ' ' + axis;
									})
									.filter((v) => v !== '')
									.join(', ');

								return `${label}: ${displayed}`;
							}
						}
					}
				},
				scales: {
					[axes.x]: {
						axis: 'x',
						title: {
							display: true,
							text: axes.x + '/' + denominator
						},
						type: 'linear',
						position: 'bottom'
						// min: 0,
						// max: 1
					},
					[axes.y]: {
						axis: 'y',
						title: {
							display: true,
							text: axes.y + '/' + denominator
						},
						type: 'linear',
						position: 'left'
						// min: 0,
						// max: 1,
						// reverse: true
					}
				}
			}
		});
		return () => {
			chart.destroy();
		};
	});
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

<div class="w-full max-w-80">
	<canvas bind:this={canvas} width="400" height="400"></canvas>
</div>
