<script lang="ts">
	import { projectManager } from '$lib/store/workspace';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	projectManager.load({ projects: data.projects });
</script>

<slot />
