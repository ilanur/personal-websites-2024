import { error } from '@sveltejs/kit';

const contensis_delivery = 'https://cms-eui.cloud.contensis.com/api/delivery/projects/euiWebsite';
const contensis_management = 'https://cms-eui.cloud.contensis.com/api/management/projects/euiWebsite';
const contensis_token = 'Wj2QPClihD74Kfie162MRMP0gKYkk1NfYjgvz49ceGRQbAeW';


export async function load({ params,  url}) {
	let is_preview = false;
	if(url.hostname =="hostname"){
		is_preview = true;
	}
	let slug = '/en/eui-intranet/' + params.slug;

	//get entry by slug
	const entry = await get_entryBySlug(slug, is_preview);
	if (entry) {
		return {
			entry
		};
	}

	error(404, 'Not found');
}

async function get_entryBySlug(slug, is_preview) {
	const url_node = contensis_delivery + '/nodes/' + slug + '?accessToken=' + contensis_token;
	const response_node = await fetch(url_node);
	let node = await response_node.json();
	//exclude system and asset CTs and child CTs wich contains __child_ct__(e.g. people__child_ct__hradditional) from cts
	console.log(node);

	//if entry exists
	if (node) {

		const url_entry = contensis_delivery + '/entries/' + node.entry.sys.id + '?linkDepth=1&accessToken=' + contensis_token;
		if(is_preview){
			url_entry += '&versionStatus=latest';
		}
		const response_entry = await fetch(url_entry);
		let entry = await response_entry.json();

		return entry;
	}

	//aggiungere chiamata ai nodi ancestors per ottenere il breadcrumb
	//aggiungere chiamata alla entry sul nodo ancestors più vicino del tipo departmentsServices
}
