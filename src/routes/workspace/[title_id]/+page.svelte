<script lang="ts">
	import ToolBar from '$lib/ui/workspace/toolbar';
	import WorkSpace from '$lib/ui/workspace/WorkSpace.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	import { getUserContext, projectManager } from '$lib/store';
	import { browser } from '$app/environment';

	const user = getUserContext();
	let id = data.project.id;
	$: {
		id = data.project.id;
	}

	$: {
		[id];
		projectChangeEffect();
	}
	function projectChangeEffect() {
		if (!browser) return;
		projectManager.load({ project: data.project });
	}
</script>

{#if $user}
	<ToolBar.Signed />
{:else}
	<ToolBar.Unsigned />
{/if}
<WorkSpace />
