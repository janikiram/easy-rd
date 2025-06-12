<script lang="ts">
	import Popup from '../popup/Popup.svelte';
	import ConfirmContent from './ConfirmContent.svelte';
	import { confirmContent, isConfirmOpen } from './confirm';

	let { title, description, cancel, confirm } = $derived($confirmContent);
</script>

<Popup bind:open={$isConfirmOpen}>
	<ConfirmContent {title} {description} {cancel} {confirm} />
</Popup>
