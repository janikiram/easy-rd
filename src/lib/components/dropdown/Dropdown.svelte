<!-- @migration-task Error while migrating Svelte code: This migration would change the name of a slot (trigger to trigger_1) making the component unusable -->
<script lang="ts">
	import { setContext } from 'svelte';
	import { cn } from '$lib/utils';
	import Portal from '$lib/components/portal';
	import { onClickOutside } from '$lib/action';

	interface $$Slots {
		default: {
			close: () => void;
		};
		trigger: {};
		content: {
			close: () => void;
		};
	}

	let isOpen = false;
	export let disabled = false;
	export let trigger: 'click' | 'hover' = 'click';
	export let position:
		| 'bottom-end'
		| 'bottom'
		| 'bottom-start'
		| 'top-end'
		| 'top'
		| 'top-start'
		| 'left-end'
		| 'left'
		| 'left-start'
		| 'right-end'
		| 'right'
		| 'right-start' = 'bottom';
	function close() {
		isOpen = false;
	}
	function open() {
		controllerRect = controllerRef.getBoundingClientRect();
		isOpen = true;
	}
	setContext('dropdown', { close });

	const handleMouseEnter = () => {
		if (trigger === 'hover') {
			open();
		}
	};
	const handleMouseLeave = () => {
		if (trigger === 'hover') {
			close();
		}
	};
	const handleClick = () => {
		if (trigger === 'click') {
			isOpen ? close() : open();
		}
	};

	let controllerRef: HTMLElement;
	let controllerRect: DOMRect;
</script>

<button
	inert={disabled}
	type="button"
	aria-haspopup="menu"
	bind:this={controllerRef}
	on:mouseenter={handleMouseEnter}
	on:click|preventDefault={handleClick}
	class:cursor-default={trigger === 'hover'}
	class="relative inline grow-0 shrink-0 p-0 m-0"
>
	<slot name="trigger" />
</button>

{#if isOpen}
	<Portal target="body">
		<button
			use:onClickOutside={close}
			on:click|preventDefault={handleClick}
			on:mouseleave={handleMouseLeave}
			class:cursor-default={trigger === 'hover'}
			style="top: {controllerRect.top}px; left: {controllerRect.left}px; width: {controllerRect.width}px; height: {controllerRect.height}px;"
			class="fixed"
		>
			<div role="menu" class={cn('dropdown-content', position)}>
				<slot {close} />
			</div>
		</button>
	</Portal>
{/if}

<style>
	.dropdown-content {
		@apply inline-block absolute z-50;
		--s: 10px;
	}
	.bottom {
		top: 100%;
		padding-top: var(--s);
		left: 50%;
		transform: translateX(-50%);
	}
	.bottom-start {
		top: 100%;
		padding-top: var(--s);
		left: 0;
	}
	.bottom-end {
		top: 100%;
		padding-top: var(--s);
		right: 0;
	}
	.top {
		bottom: 100%;
		padding-bottom: var(--s);
		left: 50%;
		transform: translateX(-50%);
	}
	.top-start {
		bottom: 100%;
		padding-bottom: var(--s);
		left: 0;
	}
	.top-end {
		bottom: 100%;
		padding-bottom: var(--s);
		right: 0;
	}
	.left {
		right: 100%;
		padding-right: var(--s);
		top: 50%;
		transform: translateY(-50%);
	}
	.left-start {
		right: 100%;
		padding-right: var(--s);
		top: 0;
	}
	.left-end {
		right: 100%;
		padding-right: var(--s);
		bottom: 0;
	}
	.right {
		left: 100%;
		padding-left: var(--s);
		top: 50%;
		transform: translateY(-50%);
	}
	.right-start {
		left: 100%;
		padding-left: var(--s);
		top: 0;
	}
	.right-end {
		left: 100%;
		padding-left: var(--s);
		bottom: 0;
	}
</style>
