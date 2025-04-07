<script lang="ts">
	import Render from './Render.svelte';
	import { parse, type Result } from '$lib/parser';

	let text = $state('sina ken ala toki pona e ijo la, sina sona ala e ijo.');
	let results: Result[] = $state([]);
	let error: Error | null = $state(null);

	let limited = $state(true);

	$effect(() => {
		if (text) {
			try {
				results = parse(text);
				error = null;
			} catch (e) {
				console.error(e);
				results = [];
				error = e as Error;
			}
		}
	});
</script>

<svelte:head>
	<title>ilo nasin</title>
</svelte:head>

<h1 class="text-3xl font-bold">ilo nasin</h1>

<input
	type="text"
	class="mt-4 w-full rounded-xl border-2 px-4 py-2 text-lg outline-none transition focus:border-gray-400"
	bind:value={text}
	placeholder="o toki pona..."
/>

<!-- <pre class="mt-4 whitespace-pre-wrap">{JSON.stringify(results, null, 2)}</pre> -->

{#if !text}
	<p class="mt-4">Enter some text to parse!</p>
{:else if error}
	<pre class="mt-4 whitespace-pre-wrap">{error.message}</pre>
{:else if !results.length}
	<p class="mt-4">Unexpected end of input.</p>
{:else if results.length === 1}
	<p class="mt-4">1 parse found.</p>
{:else}
	<p class="mt-4">
		{results.length} parses found.
	</p>
{/if}

{#each limited ? results.slice(0, 5) : results as result, i}
	<div class="mb-20 mt-4">
		{#if results.length > 1}
			<h2 class="text-xl font-bold">
				Parse {i + 1}
				<span class="text-sm font-normal text-gray-500">
					({(result.score * 100).toFixed(2)}%)
				</span>
			</h2>
		{/if}
		<Render tree={result.tree} />
	</div>
{/each}

{#if results.length > 5}
	<button
		class="mt-4 border-b-2 border-transparent font-semibold text-blue-500 transition hv:border-blue-500"
		onclick={() => (limited = !limited)}
	>
		{#if limited}
			Show {results.length - 5} more
		{:else}
			Show less
		{/if}
	</button>
{/if}
