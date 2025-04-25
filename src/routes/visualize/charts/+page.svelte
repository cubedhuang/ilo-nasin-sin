<script lang="ts">
	import _pokiData from '../taggedcounts.poki.json';
	import _discordData from '../taggedcounts.json';
	import { tags, type Tag } from '$lib/tag';
	import { slide } from 'svelte/transition';
	import type { TaggedCounts, TaggedWordCounts } from '../types';
	import { percent } from '../utils';
	import Toggle from '../Toggle.svelte';
	import LineChart from './LineChart.svelte';
	import LineChartIntj from './LineChartIntj.svelte';

	const pokiData = _pokiData as TaggedCounts;
	const discordData = _discordData as TaggedCounts;
</script>

<LineChart data={discordData} words={['luka', 'uta']} />
<LineChartIntj datas={[discordData, pokiData]} word="wawa" />
