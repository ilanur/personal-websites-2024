import { createRenderer } from '@contensis/canvas-html'
import { PUBLIC_EUI_WEB } from '$env/static/public'
import { ofetch } from 'ofetch'

export function getCanvasHTML(canvas) {
	const mapped = canvas.map((el) => {
		if (el.type === '_image' && el.value.asset.sys.uri.startsWith('/Content-Types-Assets/')) {
			el.value.asset.sys.uri = `${PUBLIC_EUI_WEB}${el.value.asset.sys.uri}`
		}

		return el
	})

	const renderer = createRenderer()
	const getCanvasHtml = (data) => renderer({ data })
	return getCanvasHtml(mapped)
}

export function canvasToText(canvas) {
	const html = getCanvasHTML(canvas)
	var tempDivElement = document.createElement('div')
	tempDivElement.innerHTML = html
	return tempDivElement.textContent || tempDivElement.innerText || ''
}

export function getCorrectEntryPhoto(personalWebsiteEntry, userEntry) {
	if (personalWebsiteEntry.usePeopleProfilePicture && userEntry.photo) {
		return `${PUBLIC_EUI_WEB}${userEntry.photo.asset.sys.uri}`
	}

	if (!personalWebsiteEntry.usePeopleProfilePicture && personalWebsiteEntry.image) {
		return `${PUBLIC_EUI_WEB}${personalWebsiteEntry.image.asset.sys.uri}`
	}

	return `${PUBLIC_EUI_WEB}/web-production/code/assets/img/default-avatar.svg`
}

export async function savePageContent(page, canvas, assetsUploadFolder) {
	const updatedPage = { ...page }

	for (const item of canvas) {
		if (item.type === '_image' && item.value.asset.sys.uri.startsWith('data:image')) {
			const file = base64toFile(item.value.asset.sys.uri)
			const formData = new FormData()
			formData.append('image', file, file.name)
			formData.append('folder', assetsUploadFolder)

			const response = await ofetch('/api/contensis/assets/upload', {
				method: 'POST',
				body: formData
			})

			item.value.asset.sys.uri = `${PUBLIC_EUI_WEB}${response.uploadedPhoto.sys.uri}`
		}
	}

	updatedPage['canvas'] = canvas

	await ofetch('/api/contensis/entries/update', {
		method: 'PUT',
		body: updatedPage
	})
}

export async function updateEntryByField(entry, field, value) {
	try {
		entry[field] = value

		await ofetch('/api/contensis/entries/update', {
			method: 'PUT',
			body: entry
		})
	} catch (e) {
		console.error('Error updating description', e)
	}
}
