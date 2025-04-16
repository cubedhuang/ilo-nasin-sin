<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		active = $bindable(),
		onclick,
		children
	}: {
		active: boolean;
		onclick?: () => void;
		children: Snippet;
	} = $props();
</script>

<button
	class="rounded border px-2 py-1 text-sm font-semibold transition {active
		? 'border-gray-800 bg-gray-800 text-gray-200 hover:bg-gray-700'
		: 'text-gray-500 hover:bg-gray-50'}"
	onclick={() => {
		if (onclick) {
			onclick();
		} else {
			active = !active;
		}
	}}
>
	{@render children()}
</button>
