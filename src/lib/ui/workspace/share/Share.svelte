<script lang="ts">

	import { isConfirm } from '$lib/components/confirm/confirm';
	import { toast } from '$lib/components/toast';
	import { projectManager } from '$lib/store';
	import type { Permission } from '$lib/types';
	import { fade } from 'svelte/transition';
	import { ArrowDownIcon, PublicIcon } from '../assets';
	import PermissionSelect from './PermissionSelect.svelte';
	import { flip } from 'svelte/animate';
	const project = projectManager.project;

	let pending = $state(false);
	const handlePermissionChange = (memberId: string, permission: Permission) => async () => {
		pending = true;
		const result = await projectManager.updatePermissionMember({
			memberId,
			permission
		});
		pending = false;

		if (result.type === 'success') {
			toast.success(result.message);
		} else {
			toast.error(result.message);
		}
	};
	const handleRemoveMember = (memberId: string, email: string) => async () => {
		const confirmed = await isConfirm(
			'Remove Member',
			`You are about to remove <strong style="color: red">${email}</strong> from collaborators, please confirm your action!`,
			{
				confirm: 'Remove',
				cancel: 'Cancel'
			}
		);
		if (!confirmed) return;

		pending = true;
		await projectManager.deleteMemberPermission({
			memberId
		});
		pending = false;
	};

	const handleCopyLink = () => {
		if (!$project.url) return;
		navigator.clipboard
			.writeText($project.url)
			.then(() => {
				toast.success('Link copied to clipboard!');
			})
			.catch((err) => {
				console.error('Failed to copy: ', err);
				toast.error('Failed to copy link.');
			});
	};

	let input: {
		email: string;
		permission: Permission;
	} = $state({
		email: '',
		permission: 'view'
	});
	const handleInvite = async () => {
		if (!input.email) return;
		pending = true;
		const result = await projectManager.invite({
			email: input.email,
			permission: input.permission
		});
		pending = false;

		if (result.type === 'success') {
			toast.success(result.message);
			input.email = '';
		} else {
			toast.error(result.message);
		}
	};
	const handlePublicPermissionChange = (permission: Permission) => async () => {
		pending = true;
		const result = await projectManager.updatePublicPermission({ permission });
		pending = false;

		if (result.type === 'success') {
			toast.success(result.message);
			input.email = '';
		} else {
			toast.error(result.message);
		}
	};
</script>

<div inert={pending} class="rounded-[3.3px] w-[600px] relative">
	<div class="bg-[#373C44] flex flex-col p-[17px_0_25.8px_0]">
		<div class="m-[0_20px_17px_20px] flex flex-row justify-between self-start w-[155.3px]">
			<div class="flex flex-row justify-center">
				<span class="break-words font-semibold text-[15px] leading-[1.2] text-[#FFFFFF]">
					Sharing
				</span>
			</div>
		</div>
		<div class=" border-[#B5B5B5] border-t m-[0_0_20px_0] h-[1px]"></div>
		<div class="m-[0_19px_0_20px] flex flex-col w-[calc(100%_-_39px)]">
			<form
				onsubmit={(e) => {
					e.preventDefault();
					handleInvite();
				}}
				class="m-[0_1px_30px_0] flex flex-row justify-between w-[calc(100%_-_1px)]"
			>
				<div
					class="rounded-[3.3px] border-[1px_solid_#DEE2E6] bg-[#FFFFFF] m-[0_10px_0_0] flex flex-row p-[7px_10px_7px_10px] grow basis-[474px]"
				>
					<div class="m-[0_6.5px_0_0] w-[375.5px]">
						<input
							bind:value={input.email}
							name="email"
							placeholder="Email"
							autocomplete="off"
							class="bg-[#FFFFFF] focus:outline-none text-[14px] text-black placeholder:text-[#9CA3AF] p-[1px_0_1px_0] w-[100%]"
						/>
					</div>
					<PermissionSelect
						color="black"
						options={{
							view: async () => {
								input.permission = 'view';
							},
							edit: async () => {
								input.permission = 'edit';
							},
							invite: async () => {
								input.permission = 'invite';
							}
						}}
						selected={input.permission}
					/>
				</div>
				<button
					type="submit"
					class="rounded-[3.3px] bg-[rgba(72,150,234,0.6)] relative flex flex-row justify-center items-center p-[8px_0_8px_0] grow basis-[76px]"
				>
					<span class="break-words font-normal text-[14px] leading-[1.5] text-[#FFFFFF]">
						Invite
					</span>
				</button>
			</form>
			<div class="flex flex-col">
				<div class="m-[0_0_4px_0] flex flex-row justify-between">
					<div class="flex flex-row">
						<div class="m-[1.3px_11px_1.3px_0] flex flex-row justify-center w-[18.5px] h-[18.5px]">
							<img class="w-[18.5px] h-[18.5px]" src={PublicIcon} alt="public" />
						</div>
						<div class="flex flex-row justify-center">
							<span class="break-words font-normal text-[14px] leading-[1.5] text-[#FFFFFF]">
								Anyone with the link
							</span>
						</div>
					</div>
					<PermissionSelect
						options={{
							view: handlePublicPermissionChange('view'),
							edit: handlePublicPermissionChange('edit')
						}}
						selected={$project.publicPermission}
					/>
				</div>
				<button
					onclick={handleCopyLink}
					class="m-[0_29.5px_0_29.5px] flex flex-row justify-center self-start"
				>
					<span class="break-words font-normal text-[14px] underline leading-[1.5] text-[#FFFFFF]">
						Copy link
					</span>
				</button>
			</div>

			<ul class="members">
				{#each $project.sharedMembers as { id, image, email, isMe, isOwner, permission } (id)}
					<li transition:fade animate:flip class="flex flex-row justify-between">
						<div class="flex flex-row items-center">
							<img class="rounded-[9999px] mr-2.5 w-[20px] h-[20px]" src={image} alt="profile" />
							<div class="flex flex-row justify-center">
								<span
									class="whitespace-nowrap font-normal text-[14px] leading-[1.5] text-[#FFFFFF]"
								>
									{email}
									{#if isMe}
										(you)
									{/if}
								</span>
							</div>
						</div>

						{#if isOwner}
							<span class="break-words font-normal text-[14px] leading-[1.5] text-[#FFFFFF]">
								owner
							</span>
						{:else}
							<PermissionSelect
								disabled={isMe}
								options={{
									view: handlePermissionChange(id, 'view'),
									edit: handlePermissionChange(id, 'edit'),
									invite: handlePermissionChange(id, 'invite'),
									remove: handleRemoveMember(id, email)
								}}
								selected={permission}
							/>
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	</div>
	{#if pending}
		<div class="overlay"></div>
	{/if}
</div>

<style>
	.members {
		@apply flex flex-col gap-[18px] mt-7 max-h-[320px] overflow-auto;
		/* 스크롤바 커스텀 스타일 */
		scrollbar-width: thin; /* Firefox */
		scrollbar-color: #6b7280 #373c44; /* Firefox: 스크롤바 색상, 스크롤바 배경 색상 */
	}
	.members::-webkit-scrollbar {
		width: 8px; /* Chrome, Safari, Opera */
	}
	.members::-webkit-scrollbar-track {
		background: #373c44; /* Chrome, Safari, Opera: 스크롤바 배경 색상 */
	}
	.members::-webkit-scrollbar-thumb {
		background-color: #6b7280; /* Chrome, Safari, Opera: 스크롤바 색상 */
		border-radius: 4px;
		border: 2px solid #373c44; /* 스크롤바와 트랙 사이의 경계 */
	}

	.overlay {
		@apply bg-white w-full h-full opacity-50 absolute top-0 left-0;
	}
</style>
