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
		<img class="ellipse ellipse-1 size-[80vw]" src="/ellipse-1.png" alt="Background ellipse 1" />
		<img class="ellipse ellipse-2 size-[80vw]" src="/ellipse-2.png" alt="Background ellipse 2" />
		<img class="ellipse ellipse-3 size-[70vw]" src="/ellipse-3.png" alt="Background ellipse 3" />
		<img class="ellipse ellipse-4 size-[70vw]" src="/ellipse-4.png" alt="Background ellipse 4" />

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
		animation-duration: 12s;
		animation-iteration-count: infinite;
		animation-timing-function: ease-in-out;
	}

	/* bottom left corner */
	.ellipse-1 {
		z-index: 4;
		transform-origin: center;
		animation-name: ellipse-1;
	}

	/* top right corner */
	.ellipse-2 {
		z-index: 3;
		transform-origin: center;
		animation-name: ellipse-2;
	}

	/* bottom right corner */
	.ellipse-3 {
		z-index: 2;
		animation-name: ellipse-3;
	}

	/* top left corner */
	.ellipse-4 {
		z-index: 1;
		animation-name: ellipse-4;
	}

	@keyframes ellipse-1 {
		0% {
			bottom: -40%;
			left: -30%;
		}
		50% {
			bottom: 30%;
			left: 35%;
		}
		100% {
			bottom: -40%;
			left: -30%;
		}
	}

	@keyframes ellipse-2 {
		0% {
			right: -5%;
			top: -25%;
		}
		50% {
			right: 35%;
			top: 35%;
		}
		100% {
			right: -5%;
			top: -25%;
		}
	}

	@keyframes ellipse-3 {
		0% {
			right: 0;
			bottom: -50%;
		}
		50% {
			right: 50%;
			bottom: 30%;
		}
		100% {
			right: 0;
			bottom: -50%;
		}
	}

	@keyframes ellipse-4 {
		0% {
			left: 5%;
			top: -20%;
		}
		50% {
			left: 30%;
			top: 50%;
		}
		100% {
			left: 5%;
			top: -20%;
		}
	}
</style>
