import { refinementList, menuSelect, toggleRefinement } from 'instantsearch.js/es/widgets'

export function eui_menuSelect(search, container, attribute, title, select_form_classes, limit = 25, sort = 'name:asc') {
	search.addWidgets([
		menuSelect({
			container: container,
			attribute: attribute,
			limit: limit,
			sortBy: [sort],
			cssClasses: {
				root: '',
				select: `block w-full bg-white border border-gray-300 text-sm rounded-lg focus:ring-eui-dark-blue-500 ${select_form_classes}`,
				option: 'bg-white'
			},
			templates: {
				defaultOption: title
			}
		})
	])
}

export function eui_toggleRefinement(search, container, attribute, title) {
	search.addWidgets([
		toggleRefinement({
			container: container,
			attribute: attribute,
			cssClasses: {
				checkbox: 'h-4 w-4 me-2 rounded border-gray-300 text-eui-dark-blue-500 focus:ring-eui-dark-blue-400',
				label: 'flex items-center',
				labelText: 'text-sm'
			},
			templates: {
				labelText: function (item) {
					if (item.count == null) {
						return
					} else {
						return title
					}
				}
			}
		})
	])
}

export function eui_refinementList(search, container, attribute, title, select_form_classes, limit = 4, sort = 'count:desc', count_value = 'hidden', has_search = false, show_more = false) {
	let searchableInput = 'hidden'
	let showSearch = 'false'
	if (has_search) {
		searchableInput = 'block w-full mb-3 bg-white border border-gray-300 text-sm rounded-lg focus:ring-eui-dark-blue-500'
		showSearch = 'true'
	}
	search.addWidgets([
		refinementList({
			container: container,
			attribute: attribute,
			searchable: showSearch,
			limit: limit,
			showMore: true,
			showMoreLimit: 2000,
			sortBy: [sort],
			cssClasses: {
				list: 'overflow-y-scroll max-h-40 2xl:max-h-56',
				label: '',
				labelText: '',
				count: count_value,
				item: 'mb-2 flex items-center',
				checkbox: 'h-4 w-4 me-2 rounded border-gray-300 text-eui-dark-blue-500 focus:ring-eui-dark-blue-400',
				select: '',
				option: 'bg-white',
				searchableSubmit: 'hidden',
				searchableReset: 'hidden',
				searchableInput: searchableInput,
				showMore: 'block w-full mt-3 pt-3 border-t text-sm text-eui-dark-blue-500 underline xxxxxx',
				disabledShowMore: 'hidden'
			}
		})
	])
}
