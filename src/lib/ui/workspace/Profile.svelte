<script lang="ts">
	import { getUserContext } from '$lib/store';
	import Dropdown from '$lib/components/dropdown/Dropdown.svelte';
	import { signOut } from '@auth/sveltekit/client';
	import { LogoutIcon } from './assets';
	const user = getUserContext();
	const handleClickSignOut = async () => {
		await signOut({ redirect: true, callbackUrl: '/workspace/demo' });
	};
</script>

<Dropdown trigger="hover" position="bottom-end">
	{#snippet triggerSlot()}
		<figure class="w-8 h-8 rounded-full overflow-hidden shrink-0">
			<img class="w-full h-full" src={$user?.image} alt="user avatar" />
		</figure>
	{/snippet}
	
	{#snippet children()}
		<div class="min-w-[200px] rounded bg-[#373C44] text-white p-1.5 translate-x-4">
			<div class="h-[36px] flex items-center text-sm w-full pl-3">
				{$user?.email}
			</div>
			<hr class="border-t border-gray-600" />
			<button onclick={handleClickSignOut} role="menuitem" class="item">
				<img src={LogoutIcon} alt="logout" class="w-6 h-6 mr-2" />
				Sign Out
			</button>
		</div>
	{/snippet}
</Dropdown>

<style>
	.item {
		@apply h-[40px] flex items-center  text-sm w-full pl-3 rounded-sm;
	}
	.item:hover {
		@apply bg-black;
	}
</style>
