<script lang="ts">
	import Chart from 'chart.js/auto';

	import type { TaggedCounts, TaggedWordCounts } from '../types';
	import { percent } from '../utils';
	import type { Tag } from '$lib/tag';

	let canvas: HTMLCanvasElement;

	const {
		data,
		words,
		tag
	}: { data: TaggedCounts; words: string[]; tag: Tag } = $props();

	const years = [2020, 2021, 2022, 2023, 2024].map((x) => x.toString());

	$effect(() => {
		const chart = new Chart(canvas, {
			type: 'line',
			data: {
				xLabels: years,
				datasets: words.map((word, i) => {
					return {
						label: word,
						data: years.map((year) => {
							const yearData = data[year];
							if (!yearData) return 0;
							const wordData = yearData[word];
							if (!wordData) return 0;

							const tagCount = wordData.counts[tag];
							const contentCount =
								wordData.counts.noun +
								wordData.counts.tverb +
								wordData.counts.iverb +
								wordData.counts.modifier;

							return tagCount / contentCount;
						}),
						borderColor: `hsl(${(i / words.length) * 360}, 80%, 60%)`,
						backgroundColor: `hsl(${(i / words.length) * 360}, 80%, 60%)`
					};
				})
			},
			options: {
				transitions: {},
				plugins: {
					title: {
						display: true,
						text: `TVerb count / Content count for ${words.join(', ')} in ma pona pi toki pona, 2024`
					}
				},
				scales: {
					x: {
						axis: 'x',
						title: {
							display: true,
							text: 'Year'
						},
						type: 'linear',
						position: 'bottom',
						ticks: {
							stepSize: 1,
							callback: (value) => {
								return value;
							}
						}

						// min: 0,
						// max: 1
					},
					y: {
						axis: 'y',
						title: {
							display: true,
							text: 'Noun count / Content count'
						},
						type: 'linear',
						position: 'left',
						min: 0,
						ticks: {
							stepSize: 0.05,
							callback: (value) => {
								return percent(+value);
							}
						}
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

<div class="w-full max-w-96">
	<canvas bind:this={canvas} width="400" height="200"></canvas>
</div>
