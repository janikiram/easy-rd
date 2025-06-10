<script lang="ts">
	import { onMount } from 'svelte';

	type T = $$Generic;
	export let id: string | undefined = undefined;
	interface $$Slots {
		head: any;
		data: any;
	}

	let tableHeadEl: HTMLElement;
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
			<slot name="head" />
		</thead>
		<slot name="data" />
	</table>
</div>

<style>
</style>
