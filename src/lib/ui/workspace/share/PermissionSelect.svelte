<script lang="ts">

	import { cn } from '$lib/utils';
	import { CheckIcon } from '../assets';
	import { ArrowDownIcon } from '../assets';
	import Dropdown from '$lib/components/dropdown/Dropdown.svelte';
	import { flip } from 'svelte/animate';
	import type { Permission } from '$lib/types';

	type Value = Permission | 'remove';
	type Option = Partial<{
		[key in Value]: () => Promise<void>;
	}>;

	interface Props {
		disabled?: boolean;
		color?: 'white' | 'black';
		selected?: Value;
		options?: Option;
	}

	let {
		disabled = false,
		color = 'white',
		selected = $bindable('view'),
		options = {
		view: async () => {
			selected = 'view';
		},
		edit: async () => {
			selected = 'edit';
		},
		invite: async () => {
			selected = 'invite';
		},
		remove: async () => {
			selected = 'remove';
		}
	}
	}: Props = $props();

	type MenuItem = {
		value: Value;
		title: string;
		description: string;
		onClick?: () => void;
	};

	const menuItems: MenuItem[] = [
		{
			value: 'view' as const,
			title: 'Can view',
			description: 'Can view, but not edit.'
		},
		{
			value: 'edit' as const,
			title: 'Can edit',
			description: 'Can edit, but not invite people.'
		},
		{
			value: 'invite' as const,
			title: 'Can edit & invite',
			description: 'Can edit & invite people.'
		},
		{
			value: 'remove' as const,
			title: 'Remove',
			titleColor: '#E53E3E',
			description: 'Remove this collaborator.'
		}
	].filter((item) => Object.hasOwn(options, item.value));

	const handleSelect = (value: Value, close: () => void) => async () => {
		await options[value]?.();
		close();
	};
</script>

<Dropdown {disabled} trigger="click" position="bottom-end">
	{#snippet triggerSlot()}
		<div class:disabled class="flex flex-row justify-center items-center">
			<span
				class:text-white={color === 'white'}
				class="break-words font-normal text-[14px] leading-[1.5] text-black"
			>
				{menuItems.find((item) => item.value === selected)?.title?.toLocaleLowerCase()}
			</span>
			<img
				class:invert={color === 'white'}
				class="size-2 ml-2 mt-0.5"
				src={ArrowDownIcon}
				alt="arrow-down"
			/>
		</div>
	{/snippet}

	{#snippet children({ close })}
		<ul class="overflow-hidden border rounded w-[240px] border-gray-300 bg-[#FFFFFF] flex flex-col">
			{#each menuItems as { value, title, description } (title)}
				<li animate:flip>
					<button
						onclick={(e) => {
							e.stopPropagation();
							e.preventDefault();
							handleSelect(value, close)();
						}}
						class="py-[6px] items-center px-[12px] hover:bg-gray-50 flex flex-row justify-between w-[100%]"
					>
						<div class="flex flex-col">
							<span
								class:text-[#E53E3E]={value === 'remove'}
								class={cn(
									'self-start break-words font-semibold text-[14px] leading-[1.5] text-[#4A5568]'
								)}
							>
								{title}
							</span>
							<span class="break-words font-normal text-[12px] leading-[1.5] text-[#718096]">
								{description}
							</span>
						</div>
						{#if value === selected}
							<div class="flex flex-row justify-center w-[12px] h-[8.9px]">
								<img class="w-4" alt="checked" src={CheckIcon} />
							</div>
						{/if}
					</button>
				</li>
			{/each}
		</ul>
	{/snippet}
</Dropdown>

<style>
	.disabled {
		@apply cursor-not-allowed;
	}
</style>
