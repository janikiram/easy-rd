<script lang="ts">
	import { initUserContext } from '$lib/store';
	import Confirm from '$lib/components/confirm/Confirm.svelte';
	import '../app.css';
	import 'pollen-css';
	import type { LayoutData } from './$types';
	import { MetaTags } from 'svelte-meta-tags';
	import { page } from '$app/stores';
	import { ToastRoot } from '$lib/components/toast';
	interface Props {
		data: LayoutData;
		children?: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();

	initUserContext(data.user);
</script>

<svelte:head>
	<link rel="stylesheet" type="text/css" href="https://static.llami.net/widget-v1.css" />
	<script type="module">
		import { initialize, run } from 'https://static.llami.net/widget-v1.js';
		run('0a413da7-2c63-48be-b129-1a05b34c8388');
	</script>
</svelte:head>

{@render children?.()}

<MetaTags
	title={$page.data.seo.title}
	description={$page.data.seo.description}
	openGraph={{
		url: $page.data.seo.url,
		siteName: 'Easy-RD',
		type: 'website',
		images: $page.data.seo.images
	}}
/>

<Confirm />
<ToastRoot />
