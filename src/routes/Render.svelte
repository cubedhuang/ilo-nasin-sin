<script lang="ts">
	import type { Tree, Word } from '$lib/types';

	export let tree: Tree | Word;
</script>

{#if 'index' in tree}
	<p
		class="relative top-3 -mt-3 rounded-md border-2 border-green-300 bg-green-50 px-1 py-0.5 text-sm"
	>
		{tree.text}
	</p>
	<!-- {:else if tree.label === '' && 'word' in tree}
	<svelte:self tree={tree.word} /> -->
{:else}
	<div
		class="relative top-3 -mt-3 w-fit rounded-md border-2 p-1
		{tree.type === 'leaf' ? 'border-blue-300 bg-blue-50' : 'bg-white'}"
	>
		<p
			class="text-xs {tree.type === 'leaf'
				? 'text-blue-800'
				: 'text-gray-500'}"
		>
			{tree.label}
		</p>

		<div class="mt-0.5 flex items-end justify-center gap-1">
			{#if tree.type === 'leaf'}
				<svelte:self tree={tree.word} />
				{#if tree.aux}
					<svelte:self tree={tree.aux} />
				{/if}
			{:else if tree.type === 'branch'}
				<svelte:self tree={tree.left} />
				<svelte:self tree={tree.right} />
			{:else if tree.type === 'rose'}
				{#each tree.children as child}
					<svelte:self tree={child} />
				{:else}
					no children for rose!
				{/each}
			{:else if tree.type === 'labelled'}
				<svelte:self tree={tree.tree} />
			{:else}
				unrecognized tree type! {JSON.stringify(tree)}
			{/if}
		</div>
	</div>
{/if}
