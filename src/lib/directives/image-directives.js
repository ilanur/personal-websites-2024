import { PUBLIC_EUI_WEB } from '$env/static/public'

export function imageProcessing(node, options = {}) {
	const { placeholder = `${PUBLIC_EUI_WEB}/web-production/code/assets/img/image-processing.jpg` } = options

	const originalSrc = node.src
	node.src = placeholder

	const img = new Image()
	img.src = originalSrc

	img.onload = () => {
		node.src = originalSrc
	}

	return {
		destroy() {
			img.onload = null
		}
	}
}
