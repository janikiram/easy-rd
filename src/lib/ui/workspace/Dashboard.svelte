<script lang="ts">
	import Table from '$lib/components/table/Table.svelte';
	import DeleteIcon from './assets/delete.svg';
	import { getUserContext, projectManager, EMPTY_PROJECT } from '$lib/store';
	import { goto } from '$app/navigation';
	import { getContext } from 'svelte';
	import { isConfirm } from '$lib/components/confirm/confirm';
	import { flip } from 'svelte/animate';
	const projects = projectManager.projects;
	let items = $projects;
	const user = getUserContext();
	let search = '';
	let sharedWithMe = false;
	const { close } = getContext<{ close: () => void }>('popup');

	$: {
		[search, sharedWithMe, $projects];
		itemsEffect();
	}
	function itemsEffect() {
		items = $projects
			.filter((p) => p.isOwner !== sharedWithMe)
			.filter((p) => {
				if (!search) return true;
				return p.name.toLowerCase().includes(search.toLowerCase());
			});
	}

	function formatDate(_date: Date | string) {
		const date = new Date(_date);
		// 날짜 포맷터 생성
		const options = {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			hour12: true
		} as const;
		const formatter = new Intl.DateTimeFormat('en-US', options);

		// 날짜 포맷팅
		let formattedDate = formatter.format(date);

		// 일자에 서수 붙이기 (1st, 2nd, 3rd, 4th...)
		const day = date.getDate();
		let suffix = 'th';
		if (day % 10 === 1 && day !== 11) suffix = 'st';
		else if (day % 10 === 2 && day !== 12) suffix = 'nd';
		else if (day % 10 === 3 && day !== 13) suffix = 'rd';

		// 서수를 포함한 최종 문자열 반환
		return formattedDate.replace(new RegExp(' ' + day), ` ${day}${suffix}`);
	}

	const handleClickNewDiagram = async () => {
		const result = await projectManager.create(EMPTY_PROJECT);
		close();
		goto(result.url);
	};

	const handleClickMyDiagrams = () => {
		sharedWithMe = false;
	};

	const handleClickSharedWithMe = () => {
		sharedWithMe = true;
	};

	const project = projectManager.project;
	const handleClickDelete = (id: string) => async (e: MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		const confirmed = await isConfirm(
			'Remove Diagram?',
			`Do you want to delete the "${$project.name}"; diagram? This action cannot be undone.`,
			{
				cancel: 'Cancel',
				confirm: 'Remove Diagram'
			}
		);
		if (!confirmed) return;

		projectManager.delete(id);

		if ($project.id !== id) return;

		const latest = $projects[0];
		if (latest) {
			goto(latest.url);
		} else {
			goto('/workspace/demo');
		}
		close();
	};
	const handleClickProject = (id: string) => (e: MouseEvent) => {
		close();
	};
</script>

<div
	role="contentinfo"
	class="shadow-[0px_20px_60px_-2px_rgba(27,33,58,0.4)] rounded-[8px] flex flex-row w-[1080px]"
>
	<aside class="border-r-[1px_solid_#565656] bg-[#2D2D2D] flex flex-col p-[0_0_268.1px_0]">
		<div class="bg-[#1A1E23] flex flex-row p-[10px_18.4px_10px_16.1px] w-[301px]">
			<div class="m-[13.4px_14.1px_13.4px_0] flex flex-row justify-center w-[15.9px] h-[18.2px]">
				<div class="w-[15.9px] h-[18.2px] img-placeholder" />
			</div>
			<div class="flex flex-row justify-between w-[236.4px] h-[fit-content]">
				<div class="flex flex-col">
					<div class="m-[0_15.5px_0_0] flex flex-row">
						<span
							class="break-words font-['Open_Sans'] font-normal text-[14px] leading-[1.786] text-[#FFFFFF]"
						>
							{$user?.email || ''}
						</span>
					</div>
					<div class="flex flex-row justify-center">
						<span
							class="break-words font-['Open_Sans'] font-normal text-[11px] leading-[1.818] text-[#8696B6]"
						>
							Personal Workspace - Free Plan
						</span>
					</div>
				</div>
				<div class="m-[16.9px_0_20.8px_0] flex flex-row justify-center w-[11.4px] h-[7.3px]">
					<div class="w-[11.4px] h-[7.3px] img-placeholder"></div>
				</div>
			</div>
		</div>
		<div class="p-2.5">
			<ul class="menu">
				<li>
					<button onclick={handleClickNewDiagram}>
						<span class="w-5 shrink-0 h-5 mr-4 img-placeholder"></span>
						<span class=""> New Diagram </span>
					</button>
				</li>
				<li>
					<button>
						<span class="w-5 shrink-0 h-5 mr-4 img-placeholder"></span>
						<span class=""> New Sample Diagram </span>
					</button>
				</li>
				<li class="w-full border-t border-[#565656] shrink-0 my-[2.5px]"></li>
				<li>
					<button onclick={handleClickMyDiagrams} class:active={!sharedWithMe}>
						<span class="w-5 shrink-0 h-5 mr-4 img-placeholder"></span>
						<span class=""> My Diagrams </span>
					</button>
				</li>
				<li>
					<button onclick={handleClickSharedWithMe} class:active={sharedWithMe}>
						<span class="w-5 shrink-0 h-5 mr-4 img-placeholder"></span>
						<span class=""> Shared With Me </span>
					</button>
				</li>
				<li class="w-full border-t border-[#565656] shrink-0 my-[2.5px]"></li>
			</ul>
		</div>
	</aside>

	<section class="relative w-[778px] h-[700px] bg-[#373C44] p-[10px_10px_0_10px]">
		<div class="m-[0_195.4px_0_0] flex flex-row w-[fit-content]">
			<div
				class="rounded-[5px] bg-[#2D2D2D] m-[0_14px_0_0] flex flex-row p-[11px_12.5px_11px_12.5px] w-[340px]"
			>
				<div class="m-[1.5px_12.5px_1.5px_0] flex flex-row justify-center w-[15px] h-[15px]">
					<div class="img-placeholder w-[15px] h-[15px]"></div>
				</div>
				<input
					placeholder="Search Diagrams"
					bind:value={search}
					class="font-normal focus:outline-none w-full bg-transparent text-[13px] placehoder:text-[#9CA3AF] text-white"
				/>
			</div>
			<div class="m-[5px_0_5px_0] flex flex-row">
				<div
					class="m-[6px_6px_6px_0] inline-block break-words font-['Open_Sans'] font-normal text-[12px] leading-[1.5] text-[#FFFFFF]"
				>
					Diagrams:
				</div>
				<div class="m-[6px_0_6px_0] flex flex-row justify-center">
					<span
						class="break-words font-['Open_Sans'] font-bold text-[12px] leading-[1.5] text-[#FFFFFF]"
					>
						{$projects.length}
					</span>
				</div>
			</div>
		</div>

		<div class="dashboard-table">
			<Table>
				{#snippet head()}
					<tr
						class="text-xs sticky top-0 bg-[#373C44] text-[#8696b6] font-semibold text-left [&_th]:p-3"
					>
						<th class="w-[340px]">Name</th>
						<th>Date Modified</th>
						<th>Date Created</th>
						<th class="w-4"></th>
					</tr>
				{/snippet}

				{#snippet data()}
					<tbody>
					{#each items as item (item.id)}
						<tr
							animate:flip
							class="text-xs hover:bg-[#1e2022] text-[#8696b6] text-left max-h-[46px] h-[46px] [&_td]:align-middle [&_td]:px-1 cursor-pointer"
							onclick={() => goto(item.url)}
						>
							<td>
								<div class="flex items-center">
									<span class="img-placeholder inline-block w-[15px] h-[15px] shrink-0 mr-3" />
									{#if item.name}
										<span class="text-[#FFFFFF]">{item.name}</span>
									{:else}
										<span class="italic">Untitled Diagram</span>
									{/if}
								</div>
							</td>
							<td>{formatDate(item.updatedAt)}</td>
							<td>{formatDate(item.createdAt)}</td>
							<td>
								<button
									class="z-10 hover:bg-red-500 w-8 h-8 flex items-center justify-center"
									aria-label="delete project"
									type="button"
									onclick={(e) => {
										e.stopPropagation();
										handleClickDelete(item.id)(e);
									}}
								>
									<img src={DeleteIcon} alt="delete" class="w-5 h-5" />
								</button>
							</td>
						</tr>
					{/each}
					</tbody>
				{/snippet}
			</Table>
		</div>
	</section>
</div>

<style>
	.img-placeholder {
		@apply border-gray-500 border;
	}
	.menu {
		@apply border-b-[1px_solid_#565656] flex flex-col;
	}
	.menu > li > button {
		@apply flex py-2.5 px-[5px] text-[13px] leading-[1.5] text-[#FFFFFF] w-full h-full;
	}
	button.active {
		background-color: #1e2022;
	}

	.menu > li:hover {
		background-color: #1e2022;
	}

	:global(.dashboard-table tbody) {
		@apply max-h-[592px] overflow-y-scroll;
	}
	.dashboard-table {
		@apply relative h-[634px] overflow-y-auto;
	}

	.dashboard-table::-webkit-scrollbar {
		width: 8px;
	}
	.dashboard-table::-webkit-scrollbar-track {
		background: transparent;
	}
	.dashboard-table::-webkit-scrollbar-thumb {
		background: #888;
		border-radius: 6px;
	}
	.dashboard-table::-webkit-scrollbar-thumb:hover {
		background: #555;
	}
</style>
