<script lang="ts">
	import Login from '../Login.svelte';
	import { SaveIcon, ArrowDownIcon, LoginIcon, LogoIcon as MenuIcon } from '../assets';
	import Popup from '$lib/components/popup/Popup.svelte';
	import { projectManager } from '$lib/store';
	let redirect: string = $state('/workspace/demo');
	let open = $state(false);
	const project = projectManager.project;

	const handleClickSave = () => {
		open = true;
		redirect = '/workspace?save=true';
	};

	const handleClickLogin = () => {
		open = true;
		redirect = '/workspace/demo';
	};
</script>

<header>
	<button class="flex gap-1 items-center">
		<img class="w-8 h-8 rounded-full overflow-hidden" src={MenuIcon} alt="menu" />
		<img class="w-2.5 h-2.5 invert" src={ArrowDownIcon} alt="arrow-down" />
	</button>
	<div class="box menu-btn w-[260px]">
		<input
			aria-label="title"
			class="w-full h-[20px] bg-transparent text-white px-2 focus-within:outline-none"
			placeholder="Untitled"
			readonly
			value={$project.name}
		/>
	</div>
	{#if !$project.id}
		<button onclick={handleClickSave} aria-label="save" class="box menu-btn">
			<img src={SaveIcon} alt="save" />
			<span class="ml-2">Save</span>
		</button>
	{/if}

	<button onclick={handleClickLogin} aria-label="login" class="box menu-btn ml-auto mr-2">
		<img src={LoginIcon} alt="login" />
		<span class="ml-2">Login</span>
	</button>
</header>

<Popup bind:open>
	<Login {redirect} />
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
	.menu-btn img {
		@apply w-4 h-4;
	}
</style>
