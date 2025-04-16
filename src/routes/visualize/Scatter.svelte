<script lang="ts">
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';

	import linku from './linku.json';
	import type { TaggedWordCounts } from './types';
	import { percent } from './utils';
	import Toggle from './Toggle.svelte';

	const { words }: { words: Record<string, TaggedWordCounts> } = $props();

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
		{ label: 'verb', value: 'v' }
	];
	const axes = $state({
		x: 'n',
		y: 'v'
	});
	let denominator = $state<'c' | 'v'>('c');

	$effect(() => {});

	$effect(() => {
		const shownWords: TaggedWordCounts[] = [];

		for (const word of Object.values(words)) {
			if (!goodWords.has(word.word)) continue;

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
				datasets: [
					{
						xAxisID: axes.x,
						yAxisID: axes.y,
						data: shownWords.map((word) => {
							const contentCount =
								word.counts.noun +
								word.counts.tverb +
								word.counts.iverb +
								word.counts.modifier;
							let denom = contentCount;
							if (denominator === 'v') {
								denom = word.counts.tverb + word.counts.iverb;
							}
							const value = {
								label: word.word,
								n: word.counts.noun / denom,
								iv: word.counts.iverb / denom,
								tv: word.counts.tverb / denom,
								m: word.counts.modifier / denom,
								v:
									(word.counts.tverb + word.counts.iverb) /
									denom,
								x: 0,
								y: 0
							};
							value.x = value[axes.x as 'n'];
							value.y = value[axes.y as 'n'];
							return value;
						}),
						backgroundColor: 'rgba(255, 99, 132, 1)'
					}
				]
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
								const { n, iv, tv, m } = item.raw as Record<
									string,
									number
								>;
								return `${(item.raw as Record<string, string>).label}: ${percent(
									n
								)} noun, ${percent(iv)} iv, ${percent(
									tv
								)} tv, ${percent(m)} mod`;
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
						position: 'top'
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
						position: 'left',
						// min: 0,
						// max: 1,
						reverse: true
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
	<Toggle
		active={denominator === 'c'}
		onclick={() => {
			denominator = 'c';
		}}
	>
		c
	</Toggle>
	<Toggle
		active={denominator === 'v'}
		onclick={() => {
			denominator = 'v';
		}}
	>
		v
	</Toggle>
</p>

<div class="w-full max-w-3xl">
	<canvas bind:this={canvas} width="400" height="400"></canvas>
</div>
