<script lang="ts">
	import Confirm from '$lib/components/confirm/Confirm.svelte';
	import { ToastRoot } from '$lib/components/toast';
</script>

<slot />
<Confirm />
<ToastRoot />
