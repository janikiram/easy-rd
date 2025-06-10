export { default as ToastRoot } from './Toast.svelte';
import { toast as _toast } from '@zerodevx/svelte-toast';

export const toast = {
	success: (message: string) => {
		_toast.push(`<strong>Success</strong> <br /> ${message}`, {
			theme: {
				'--toastBackground': 'green',
				'--toastColor': 'white',
				'--toastBarBackground': 'olive'
			}
		});
	},
	error: (message: string) => {
		_toast.push(`<strong>Error</strong> <br /> ${message}`, {
			theme: {
				'--toastBackground': 'red',
				'--toastColor': 'white',
				'--toastBarBackground': 'olive'
			}
		});
	}
};
