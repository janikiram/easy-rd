<script lang="ts">
	import { run } from 'svelte/legacy';

	import ToolBar from '$lib/ui/workspace/toolbar';
	import WorkSpace from '$lib/ui/workspace/WorkSpace.svelte';
	import type { PageData } from './$types';
	import { getUserContext, projectManager } from '$lib/store';
	import { browser } from '$app/environment';
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const user = getUserContext();
	let id = $state(data.project.id);

	function projectChangeEffect() {
		if (!browser) return;
		projectManager.load({ project: data.project });
	}
	run(() => {
		id = data.project.id;
	});
	run(() => {
		[id];
		projectChangeEffect();
	});
</script>

{#if $user}
	<ToolBar.Signed />
{:else}
	<ToolBar.Unsigned />
{/if}
<WorkSpace />
