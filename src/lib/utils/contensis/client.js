import { createRenderer } from '@contensis/canvas-html'
import { PUBLIC_EUI_WEB } from '$env/static/public'

export function getCanvasHTML(canvas) {
	const mapped = canvas.map((el) => {
		const obj = el

		if (el.type === '_image' && el.value.asset.sys.uri.startsWith('/Content-Types-Assets/')) {
			obj.value.asset.sys.uri = `${PUBLIC_EUI_WEB}${el.value.asset.sys.uri}`
		}

		return obj
	})

	const renderer = createRenderer()
	const getCanvasHtml = (data) => renderer({ data })
	const html = getCanvasHtml(mapped)
	return html
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
