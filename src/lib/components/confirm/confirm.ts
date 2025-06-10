import writableOnlyClient from '$lib/store/writable-only-client';

export const confirmContent = writableOnlyClient<{
	title: string;
	description: string;
	cancel?: string;
	confirm?: string;
}>({
	title: '',
	description: ''
});
export const isConfirmStore = writableOnlyClient<(value: boolean) => void>(() => {});
export const isConfirmOpen = writableOnlyClient(false);

export function isConfirm(
	title: string,
	description = '',
	{ cancel, confirm }: { cancel?: string; confirm?: string } = {}
): Promise<boolean> {
	return new Promise((resolve) => {
		confirmContent.set({
			title,
			description,
			cancel,
			confirm
		});
		isConfirmOpen.set(true);
		isConfirmStore.set(resolve);
	});
}
