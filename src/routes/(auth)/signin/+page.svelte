<script lang="ts">
	import type { PageData } from './$types';
	import { signIn } from '@auth/sveltekit/client';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const { session } = data;

	const handleGithubSignIn = () => {
		signIn('github', { callbackUrl: '/signin/after' });
	};
</script>

{#if session}
	<h1>Already signed in. Will be redirected</h1>
{:else}
	<div class="container">
		<div class="form">
			<div class="panel">Easy-RD</div>
			<button class="login-button" onclick={handleGithubSignIn}>
				<img src="https://authjs.dev/img/providers/github.svg" alt="github-logo" />Sign in with
				Github
			</button>
		</div>
	</div>
{/if}

<style>
	.container {
		flex-direction: column;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100vh;
	}

	.form {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: var(--color-grey-100);
		border-radius: var(--size-4);
		border: 1px solid var(--color-grey-300);
		padding: 2rem 4rem;
		gap: var(--size-4);
	}
	.form > .panel {
		font-size: var(--size-8);
	}

	.login-button {
		padding: 1rem 2rem;
		background-color: #24292e;
		border: none;
		border-radius: 0.5rem;
		color: #fff;
		font-size: 1.5rem;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
		padding: auto;
		display: flex;
		gap: var(--size-4);
		align-items: center;
		justify-content: center;
	}
</style>
