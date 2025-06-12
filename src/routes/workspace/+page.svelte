<script lang="ts">
	import ToolBar from '$lib/ui/workspace/toolbar/ToolBar.svelte';
	import WorkSpace from '$lib/ui/workspace/WorkSpace.svelte';
	import { getUserContext, projectManager } from '$lib/store';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	const user = getUserContext();
	const project = projectManager.project;
	const projects = projectManager.projects;
	//const projects = p
	onMount(async () => {
		if (user == null) return goto('/workspace/demo');

		const willSave = page.url.searchParams.get('save') === 'true';
		if (willSave) {
			const { url } = await projectManager.create($project);
			return goto(url);
		}

		const latestProject = $projects[0];
		if (latestProject == null) return goto('/workspace/demo');

		goto(latestProject.url, { replaceState: true });
	});
</script>

<div inert role="presentation" aria-hidden="true" class="overlay">
	<ToolBar />
	<WorkSpace />
</div>

<style>
	.overlay {
		@apply bg-white opacity-50 fixed inset-0 flex flex-col;
	}
</style>
