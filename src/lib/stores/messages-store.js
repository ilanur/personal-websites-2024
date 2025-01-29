import { writable } from 'svelte/store'

export const message = writable({
	open: false,
	type: 'warning', // primary | warning | success | error
	text: 'This is a warning message'
})

export function showPublishedWarning() {
	message.set({
		open: true,
		type: 'warning',
		text: 'Your website is not published yet. To make it visible to others, publish your personal website on the settings page.'
	})
}

export function closeMessage() {
	message.set({ open: false, type: '', text: '' })
}
