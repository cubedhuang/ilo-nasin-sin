<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="mb-20 mt-8 px-8">
	<nav class="mb-8 flex gap-8 text-gray-500">
		<a href="/" class="hover:text-black">home</a>
		<a href="/analyze" class="hover:text-black">counter</a>
		<a href="/visualize" class="hover:text-black">visualize</a>
	</nav>

	{@render children()}
</div>
