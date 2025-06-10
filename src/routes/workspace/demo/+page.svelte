<script lang="ts">
	import ToolBar from '$lib/ui/workspace/toolbar/ToolBar.svelte';
	import ToolBarWithSignedIn from '$lib/ui/workspace/toolbar/ToolBarWithSignIn.svelte';
	import WorkSpace from '$lib/ui/workspace/WorkSpace.svelte';
	import { getUserContext, projectManager, DEFAULT_PROJECT } from '$lib/store';
	import { onMount } from 'svelte';

	const user = getUserContext();
	const project = projectManager.project;
	onMount(() => {
		$project = DEFAULT_PROJECT;
	});
</script>

{#if $user}
	<ToolBarWithSignedIn />
{:else}
	<ToolBar />
{/if}
<WorkSpace />
