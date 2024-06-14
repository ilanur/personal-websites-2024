<script>
	import { SignIn } from '@auth/sveltekit/components';
	import { browser } from '$app/environment';
	import IconLogoEui from '$lib/components/icons/IconLogoEui.svelte';

	if (browser) {
		document.querySelector('body').classList.add('overflow-hidden');
	}
</script>

<div class="fixed inset-0 z-50 bg-[#F8FAFC]">
	<div class="relative size-full">
		<div class="ellipse ellipse-1 size-[676px] bg-[#0555A280]" />
		<div class="ellipse ellipse-2 size-[497px] bg-[#2181C480]" />
		<div class="ellipse ellipse-3 size-[1060px] bg-[#F0F2F5]" />
		<div class="ellipse ellipse-4 size-[858px] bg-[#EFF6FF]" />

		<div class="container relative z-10 flex h-full flex-col items-start py-10">
			<div class="h-[52px]">
				<IconLogoEui />
			</div>

			<div class="flex size-full flex-col items-center justify-center">
				<h1 class="text-7xl font-black text-[#1E293B]">EUI Intranet Portal</h1>

				<SignIn signInPage="auth/login" provider="microsoft-entra-id" className="mb-11 mt-9">
					<div
						slot="submitButton"
						class="rounded bg-[#0555A2] px-11 py-4 text-2xl font-bold text-white"
					>
						<span>Sign in</span>
					</div>
				</SignIn>

				<p class="max-w-2xl text-center text-base">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit pretium, placerat
					risus et, hendrerit urna. Morbi ac nibh fermentum, congue ligula ac, tristique purus.
				</p>
			</div>
		</div>
	</div>
</div>

<style>
	/* Still WIP */
	.ellipse {
		position: absolute;
		border-radius: 99999px;
		animation-duration: 6s;
		animation-iteration-count: infinite;
		animation-timing-function: ease-in-out;
	}

	/* bottom left corner */
	.ellipse-1 {
		bottom: 0;
		left: 0;
		z-index: 4;
		filter: blur(250px);
		transform: translate(-40%, 40%);
		animation-name: ellipse-1;
	}

	/* top right corner */
	.ellipse-2 {
		right: 0;
		top: 0;
		z-index: 3;
		filter: blur(150px);
		transform: translate(-20%, -20%);
		animation-name: ellipse-2;
	}

	/* bottom right corner */
	.ellipse-3 {
		right: 0;
		bottom: 0;
		z-index: 2;
		filter: blur(250px);
		transform: translate(0, 55%);
		animation-name: ellipse-3;
	}

	/* top left corner */
	.ellipse-4 {
		left: 0;
		top: 0;
		z-index: 1;
		filter: blur(250px);
		transform: translate(15%, -45%);
		animation-name: ellipse-4;
	}

	@keyframes ellipse-1 {
		0% {
			transform: translate(-40%, 40%);
		}
		50% {
			transform: translate(80%, -30%);
		}
		100% {
			transform: translate(-40%, 40%);
		}
	}

	@keyframes ellipse-2 {
		0% {
			transform: translate(-20%, -20%);
		}
		50% {
			transform: translate(-150%, 80%);
		}
		100% {
			transform: translate(-20%, -20%);
		}
	}
</style>
