<script lang="ts">

	import { onDestroy, onMount } from 'svelte';
	import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
	import clsx from 'clsx';

	
	interface Props {
		readOnly?: boolean;
		code: string;
		class: string;
		onChange?: () => void;
		markers?: Monaco.editor.IMarkerData[];
	}

	let {
		readOnly = false,
		code = $bindable(),
		class: className,
		onChange = () => {},
		markers = []
	}: Props = $props();
	let editorRef: HTMLDivElement = $state();
	let context: {
		editor: Monaco.editor.IStandaloneCodeEditor;
		module: typeof Monaco;
		resizeObserver: ResizeObserver;
	};
	let model: Monaco.editor.ITextModel;
	let modelChangeSyncEffect = true;

	function codeChangeSyncEffect() {
		if (model == null) return;
		if (!modelChangeSyncEffect) {
			modelChangeSyncEffect = true;
			return;
		}
		model.setValue(code);
	}

	function setMarkers() {
		if (context) {
			context.module.editor.setModelMarkers(model, 'owner', markers);
		}
	}

	$effect(() => {
		codeChangeSyncEffect();
	});

	$effect(() => {
		setMarkers();
	});

	onMount(async () => {
		// Should avoid bundling monaco-editor module on server side.
		const module = (await import('./monaco')).default;
		model = module.editor.createModel(code, 'dbml');
		const editor = module.editor.create(editorRef, {
			theme: 'vs-dark',
			language: 'dbml',
			model,
			minimap: { enabled: false }
		});
		editor.onKeyDown((event) => {
			modelChangeSyncEffect = false;
			code = model.getValue();
		});
		model.onDidChangeContent(() => {
			code = model.getValue();
		});
		editor.onDidChangeModelContent(() => {
			onChange();
		});

		const resizeObserver = new ResizeObserver(() => {
			editor.layout();
		});
		resizeObserver.observe(editorRef);

		context = { editor, module, resizeObserver };
	});

	onDestroy(() => {
		if (!context) return;

		context.module.editor.getModels().forEach((model) => model.dispose());
		context.editor.dispose();
		context.resizeObserver.disconnect();
	});
</script>

<div class="inline-block h-full bg-[#1E1E1E] relative">
	<div inert={readOnly} class={clsx('h-full', className)} bind:this={editorRef}></div>
	{#if readOnly}
		<div title="Edit is not allowed" class="absolute inset-0 bg-white/10 cursor-not-allowed"></div>
	{/if}
</div>

<style>
	.editor {
		height: 100%;
	}
</style>
