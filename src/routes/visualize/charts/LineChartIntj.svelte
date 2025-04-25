<script lang="ts">
	import Chart from 'chart.js/auto';

	import type { TaggedCounts, TaggedWordCounts } from '../types';
	import { percent } from '../utils';

	let canvas: HTMLCanvasElement;

	const { datas, word }: { datas: TaggedCounts[]; word: string } = $props();

	const years = [2020, 2021, 2022, 2023, 2024].map((x) => x.toString());

	$effect(() => {
		const chart = new Chart(canvas, {
			type: 'line',
			data: {
				xLabels: years,
				datasets: datas.map((data, i) => {
					return {
						label: i === 0 ? 'Informal' : 'Formal',
						data: years.map((year) => {
							const yearData = data[year];
							if (!yearData) return 0;
							const wordData = yearData[word];
							if (!wordData) return 0;

							const intj = wordData.counts.interjection_head;

							return intj / wordData.total;
						}),
						borderColor: `hsl(${(i / datas.length) * 360}, 80%, 60%)`,
						backgroundColor: `hsl(${(i / datas.length) * 360}, 80%, 60%)`
					};
				})
			},
			options: {
				transitions: {},
				plugins: {},
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
							text: 'Intj count / Total'
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
