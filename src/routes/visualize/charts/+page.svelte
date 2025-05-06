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
	import LineChartTags from './LineChartTags.svelte';

	const pokiData = _pokiData as TaggedCounts;
	const discordData = _discordData as TaggedCounts;
</script>

<LineChart data={discordData} words={['luka', 'uta']} tag="tverb" />
<LineChartTags data={discordData} word="pu" tags={['noun', 'modifier']} />
<LineChartIntj
	datas={[discordData, pokiData]}
	word="pona"
	tag="interjection_head"
/>
<LineChartIntj
	datas={[discordData, pokiData]}
	word="wawa"
	tag="interjection_head"
/>
<LineChartIntj datas={[discordData, pokiData]} word="luka" tag="tverb" />
<LineChartIntj datas={[discordData, pokiData]} word="uta" tag="tverb" />
<LineChartIntj datas={[discordData, pokiData]} word="pu" tag="noun" />
