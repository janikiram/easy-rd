<script lang="ts">
	import Header from '$lib/ui/app-layout/Header.svelte';
	import Footer from '$lib/ui/app-layout/Footer.svelte';
	import { signOut } from '@auth/sveltekit/client';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	function handleSignOutClicked() {
		signOut();
	}
</script>

<div class="layout">
	<Header on:signOut={handleSignOutClicked} />
	<div class="content">
		{@render children?.()}
		<Footer />
	</div>
</div>

<style>
	.layout {
		--content-width: 1200px;
		--content-padding: 16px;
		--height-height: 70px;
	}
	.content {
		width: 100%;
		flex: 0;
		padding-top: var(--height-height);
		overflow-y: auto;
		height: 100vh;
		max-height: 100vh;
		min-height: 100vh;
	}
	.content::-webkit-scrollbar {
		width: 8px;
	}
	.content::-webkit-scrollbar-track {
		background: #f1f1f1;
		border-radius: 6px;
	}
	.content::-webkit-scrollbar-thumb {
		background: #888;
		border-radius: 6px;
	}
	.content::-webkit-scrollbar-thumb:hover {
		background: #555;
	}
	:global(html) {
		background-color: white;
	}
</style>
