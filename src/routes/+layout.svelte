<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="mb-20 mt-8 px-8">
	<nav class="mb-8 flex flex-wrap gap-x-8 gap-y-2 text-gray-500">
		<a href="/" class="hover:text-black">home</a>
		<a href="/analyze" class="hover:text-black">counter</a>
		<a href="/charts" class="hover:text-black">charts</a>
		<a href="/visualize" class="hover:text-black">data</a>
		<a href="/paper" class="hover:text-black">paper</a>
		<a
			href="https://github.com/cubedhuang/ilo-nasin-sin"
			class="ml-auto hover:text-black">GitHub</a
		>
	</nav>

	{@render children()}
</div>
