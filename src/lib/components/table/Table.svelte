<script lang="ts">
	import { onMount } from 'svelte';

	type T = $$Generic;
	interface Props {
		id?: string | undefined;
		head?: import('svelte').Snippet;
		data?: import('svelte').Snippet;
	}

	let { id = undefined, head, data }: Props = $props();

	let tableHeadEl: HTMLElement = $state();
	let headItemCount = 0;
	onMount(() => {
		if (tableHeadEl) {
			headItemCount = tableHeadEl.children[0]?.childElementCount || 0;
		}
	});
</script>

<div {id} data-table-type="table-wrapper">
	<table class="w-full table-auto">
		<thead bind:this={tableHeadEl}>
			{@render head?.()}
		</thead>
		{@render data?.()}
	</table>
</div>

<style>
</style>
