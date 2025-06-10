<script>
	import PriceChoiceSection from '$lib/ui/pricing/PriceChoiceSection.svelte';
</script>

<main class="dark-theme relative flex flex-col items-center p-8 min-h-screen">
	<div class="max-w-6xl w-full space-y-16">
		<PriceChoiceSection />
	</div>
</main>

<style>
	main.dark-theme {
		background: linear-gradient(to bottom, #1a1a1a, #2d2d2d);
		min-height: 100vh;
		color: #ffffff;
	}
</style>
