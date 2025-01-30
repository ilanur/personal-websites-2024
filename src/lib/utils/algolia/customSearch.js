import { connectSearchBox } from 'instantsearch.js/es/connectors'

const renderSearchBox = (renderOptions, isFirstRender) => {
	const { query, refine, widgetParams } = renderOptions
	const container = document.querySelector(widgetParams.container)

	if (container) {
		if (isFirstRender) {
			container.innerHTML = `<input type="text" name="search" class="block w-full rounded-md border-0 px-4 text-base text-gray-900 placeholder-gray-600 focus:ring-offset-eui-dark-blue-500 focus:outline-none focus:ring-offset-2 focus:ring-2 focus:ring-eui-light-blue-100" placeholder="${widgetParams.placeholder}" value="${query}" />`

			const input = container.querySelector('input')

			input.addEventListener('input', (event) => {
				refine(event.currentTarget.value)
			})
		}

		// Carefully update input to preserve user edits
		const input = container.querySelector('input')

		if (document.activeElement !== input) {
			// check if the input is not currently focused
			input.value = query
		}
	}
}
export const customSearch = connectSearchBox(renderSearchBox)
