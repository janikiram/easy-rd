<script lang="ts">
	import { getContext } from 'svelte';
	import { isConfirmStore } from './confirm';
	import { onClickOutside } from '$lib/action';

	interface Props {
		title: string;
		description: string;
		cancel?: string;
		confirm?: string;
	}

	let {
		title,
		description,
		cancel = 'Cancel',
		confirm = 'Confirm'
	}: Props = $props();

	const { close } = getContext<{ close: () => void }>('popup');
	const handleConfirm = (value: boolean) => () => {
		$isConfirmStore(value);
		close();
	};
	const handleClickOutside = () => {
		$isConfirmStore(false);
		close();
	};
</script>

<div
	use:onClickOutside={handleClickOutside}
	class="w-[550px] shadow-[0px_6.5px_13px_0px_rgba(0,0,0,0.15)] rounded-[3.3px] bg-[#2A3346] flex flex-col p-[24px_24px_43px_43.5px]"
>
	<h2 class="border-b-[1px_solid_#4A5568] m-[0_19.5px_5.3px_0] p-[7px_0_7px_0]">
		<span class="break-words font-semibold text-[24.4px] leading-[1.199] text-[#F5F6F8]">
			{title}
		</span>
	</h2>
	<p class="m-[0_15.2px_38.5px_0]">
		<span class="break-words font-normal text-[13px] leading-[1.5] text-[#E2E8F0]">
			{@html description}
		</span>
	</p>
	<div class="flex flex-row ml-auto">
		<button
			type="button"
			onclick={handleConfirm(false)}
			class="rounded-[3.3px] border border-[#EDF2F7] m-[0_19.5px_0_0] flex flex-row justify-center p-[6.3px_19.7px_6.8px_19.7px]"
		>
			<span class="break-words font-semibold text-[13px] leading-[1.5] text-[#F5F6F8]">
				{cancel}
			</span>
		</button>
		<button
			onclick={handleConfirm(true)}
			class="rounded-[3.3px] bg-[#FC8181] flex flex-row justify-center p-[7.3px_19.8px_7.8px_19.8px]"
		>
			<span class="break-words font-semibold text-[13px] leading-[1.5] text-[#FFFFFF]">
				{confirm}
			</span>
		</button>
	</div>
</div>
