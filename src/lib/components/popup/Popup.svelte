<script lang="ts">
	import { fade, type TransitionConfig } from 'svelte/transition';
	import ExitIcon from './exit.svg';
	import { cubicOut } from 'svelte/easing';
	import { cn } from '$lib/utils';
	import { setContext } from 'svelte';
	import { onClickOutside } from '$lib/action';
	import Portal from 'svelte-portal';
	interface Props {
		open?: boolean;
		closeOnClickOutside?: boolean;
		exit?: import('svelte').Snippet;
		children?: import('svelte').Snippet<[any]>;
	}

	let {
		open = $bindable(false),
		closeOnClickOutside = false,
		exit,
		children
	}: Props = $props();

	function fly({}: {}): TransitionConfig {
		return {
			delay: 0,
			easing: cubicOut,
			duration: 400,
			css: (t: number) => `
							top: ${t * 50}%;
	            opacity: ${t};
	        `
		};
	}
	function close() {
		open = false;
	}
	const handleClickOutside = () => {
		if (closeOnClickOutside) {
			open = false;
		}
	};
	setContext('popup', { close });
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && (open = false)} />
{#if open}
	<Portal target="body">
		<div
			transition:fade={{ duration: 400, easing: cubicOut }}
			class="fixed inset-0 bg-black/60 flex justify-center items-center"
		></div>
		<div use:onClickOutside={handleClickOutside} transition:fly class={cn('popup ', 'middle')}>
			<button class="exit" aria-label="close" onclick={() => (open = false)}>
				{#if exit}{@render exit()}{:else}
					<img class="size-6" src={ExitIcon} alt="exit" />
				{/if}
			</button>
			{@render children?.({ close, })}
		</div>
	</Portal>
{/if}

<style>
	.popup {
		@apply w-fit shrink-0 grow-0 h-fit relative rounded block bg-[#373C44];
	}

	button.exit {
		@apply absolute top-[15px] right-[15px] inline-block z-10;
	}
	button.exit > img {
		@apply w-full h-full;
	}
	.middle {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
