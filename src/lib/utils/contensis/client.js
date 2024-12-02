import { createRenderer } from '@contensis/canvas-html'

export function getCanvasHTML(canvas) {
	const renderer = createRenderer()
	const getCanvasHtml = (data) => renderer({ data })
	const html = getCanvasHtml(canvas)
	return html
}
