<script lang="ts">
	import Widget from '@meursyphus/flitter-svelte';
	import Diagram from './widget/Diagram';
	import type { Project } from './type';

	type Subscribe = (callback: (project: Project) => void) => () => void;

	interface Props {
		project: Project;
		subscribe?: Subscribe;
	}

	let { project, subscribe = () => () => {} }: Props = $props();
</script>

<Widget widget={Diagram({ project, subscribe })} width="100%" height="100%" />

<style>
	:global(svg text) {
		user-select: none;
	}
</style>
