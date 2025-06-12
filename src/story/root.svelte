<script lang="ts">
	import Confirm from '$lib/components/confirm/Confirm.svelte';
	import { ToastRoot } from '$lib/components/toast';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

{@render children?.()}
<Confirm />
<ToastRoot />
