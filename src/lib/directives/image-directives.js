export function loadImage(node, options = {}) {
	const { placeholder = '/path/to/your/placeholder-image.jpg' } = options

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
