<script lang="ts">

	import { ProjectModel, emptyProjectModel } from '$lib/dbml/type';
	import type { CompilerDiagnostic, CompilerError } from '$lib/dbml';
	import { Diagram } from '$lib/components/diagram';
	import { Editor } from '$lib/components/editor';
	import { writable } from 'svelte/store';
	import { projectManager } from '$lib/store';
	import { onMount } from 'svelte';
	import * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
	import { convertToMarker } from '$lib/components/editor/utils';

	const model = writable<ProjectModel>(emptyProjectModel);
	const project = projectManager.project;
	let parse: (code: string) => ProjectModel = () => {
		throw new Error('parse is undefined');
	};

	let markers: Monaco.editor.IMarkerData[] = $state([]);

	onMount(async () => {
		const dbml = await import('$lib/dbml');
		dbml.parse;
		parse = dbml.parse;
		projectChangeEffect();
	});

	async function projectChangeEffect() {
		markers = [];
		try {
			$model = parse($project.resource.code);
		} catch (e) {
			if (typeof e === 'object' && e !== null && 'diags' in e) {
				markers = convertToMarker((e as { diags: CompilerDiagnostic[] }).diags);
			}
			$model = emptyProjectModel;
		}
	}

	const handleEdit = () => {
		projectManager.update({ resource: $project.resource });
		projectChangeEffect();
	};
	
	$effect(() => {
		const currentId = $project.id;
		projectChangeEffect();
	});
</script>

<main>
	<Editor
		readOnly={!$project.permission.canEdit}
		onChange={handleEdit}
		class="editor-panel"
		bind:code={$project.resource.code}
		{markers}
	/>
	<div class="diagram">
		{#if $model}
			<Diagram project={$model} subscribe={model.subscribe} />
		{/if}
	</div>
</main>

<style>
	main {
		@apply flex;
		height: calc(100vh - 52px);
	}
	.diagram {
		@apply bg-[#44444C] h-full w-full;
	}
	:global(.editor-panel) {
		@apply shrink-0 w-[400px];
	}
</style>
