<script>
	import { message } from '$lib/stores/messages-store'
	import clsx from 'clsx'
</script>

{#if $message.open}
	<div
		class={clsx('text-tiny font-semibold', {
			'bg-blue-100 text-blue-600': $message.type === 'primary',
			'bg-yellow-100 text-yellow-600': $message.type === 'warning',
			'bg-green-100 text-green-600': $message.type === 'success',
			'bg-red-100 text-red-600': $message.type === 'error'
		})}
	>
		<div class="container py-2">
			{$message.text}
		</div>
	</div>
{/if}
