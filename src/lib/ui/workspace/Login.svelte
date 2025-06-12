<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';
	import { GithubLogoIcon as githubIcon } from './assets';

	interface Props {
		redirect: string;
	}

	let { redirect }: Props = $props();
	const handleGithubSignIn = () => {
		signIn('github', { callbackUrl: `/signin/after?redirect=${redirect}` });
	};
</script>

<div
	aria-roledescription="dialog-content"
	class="w-[530px] text-white flex flex-col items-center p-[30px]"
>
	<h2 class="text-3xl mt-[50px]">Welcome to <strong>Easy-Rd</strong></h2>
	<p class="mt-[62px]">Please login with your GitHub account</p>
	<button
		aria-label="Sign in with Github"
		onclick={handleGithubSignIn}
		class="mt-4 mb-5 login-button"
	>
		<span class="bg-white w-[60px] h-full shrink-0 flex items-center justify-center">
			<img class="size-12 shrink-0" src={githubIcon} alt="github-logo" />
		</span>
		<span class="flex justify-center grow">Sign in with Github</span>
	</button>
</div>

<style>
	.login-button {
		height: 60px;
		width: 300px;
		background-color: black;
		border: none;
		border-radius: 0.5rem;
		color: #fff;
		font-size: 1.5rem;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
		padding: auto;
		display: flex;
		align-items: center;
		overflow: hidden;
	}
</style>
