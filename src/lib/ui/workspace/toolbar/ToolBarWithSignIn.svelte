<script lang="ts">
	import Popup from '$lib/components/popup/Popup.svelte';
	import { SaveIcon, ArrowDownIcon, LogoIcon as MenuIcon, ShareIcon } from '../assets';
	import Dashboard from '../Dashboard.svelte';
	import Share from '../share/Share.svelte';
	import { projectManager } from '$lib/store';
	import { goto } from '$app/navigation';
	import Profile from '../Profile.svelte';

	let dashboardOpen = $state(false);
	let shareOpen = $state(false);
	const project = projectManager.project;
	const handleClickSave = async () => {
		const { url } = await projectManager.create($project);
		goto(url);
	};
	const handleClickMenu = () => {
		dashboardOpen = true;
	};
	const handleClickShare = () => {
		shareOpen = true;
	};
	const handleInputChange = () => {
		projectManager.update({ name: $project.name });
	};
</script>

<header>
	<button onclick={handleClickMenu} class="flex gap-1 items-center">
		<img class="w-8 h-8 rounded-full overflow-hidden" src={MenuIcon} alt="menu" />
		<img class="w-2.5 h-2.5 invert" src={ArrowDownIcon} alt="arrow-down" />
	</button>
	<div class="box menu-btn w-[260px]">
		<input
			aria-label="title"
			class="w-full h-[20px] bg-transparent text-white px-2 focus-within:outline-none"
			placeholder="Untitled"
			bind:value={$project.name}
			oninput={handleInputChange}
		/>
	</div>
	{#if !$project.id}
		<button onclick={handleClickSave} aria-label="save" class="box menu-btn">
			<img src={SaveIcon} alt="save" />
			<span class="ml-2">Save</span>
		</button>
	{:else if $project.permission.canInvite}
		<button onclick={handleClickShare} aria-label="share" class="box menu-btn">
			<img class="w-4" src={ShareIcon} alt="share" />
			<span class="ml-2">Share</span>
		</button>
	{/if}
	<div class="ml-auto mr-2 flex">
		<Profile />
	</div>
</header>

<Popup bind:open={dashboardOpen}>
	<Dashboard />
</Popup>

<Popup bind:open={shareOpen}>
	<Share />
</Popup>

<style>
	header {
		@apply shrink-0 flex items-center h-[52px] bg-[#1c2128] px-2 gap-1.5;
	}

	.box {
		@apply bg-[#373C44] rounded flex  items-center px-2.5 text-white;
	}
	.menu-btn {
		@apply h-[32px];
	}
</style>
