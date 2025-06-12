<script lang="ts">
	import { projectManager } from '$lib/store/workspace';
	import type { LayoutData } from './$types';

	interface Props {
		data: LayoutData;
		children?: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();
	projectManager.load({ projects: data.projects });
</script>

{@render children?.()}
