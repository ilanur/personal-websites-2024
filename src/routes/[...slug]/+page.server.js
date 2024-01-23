const contensis_delivery = 'https://cms-eui.cloud.contensis.com/api/delivery/projects/euiWebsite';
const contensis_management = 'https://cms-eui.cloud.contensis.com/api/management/projects/euiWebsite';
const contensis_token = "Wj2QPClihD74Kfie162MRMP0gKYkk1NfYjgvz49ceGRQbAeW";

import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  console.log(params.slug);

  //get entry by slug
  const entry = await get_entryBySlug(params.slug);
  console.log(entry);
  if (entry){


    return {
      entry
    };
  }
 
  error(404, 'Not found');
}


async function get_entryBySlug(slug) {
    const url_node = contensis_delivery + '/nodes/'+slug+'?accessToken=' + contensis_token;
    const response_node = await fetch(url_node);
    let node = await response_node.json();
    //exclude system and asset CTs and child CTs wich contains __child_ct__(e.g. people__child_ct__hradditional) from cts
    console.log(node);

    //if entry exists
    if (node) {
      const url_entry = contensis_delivery + '/entries/'+node.entry.sys.id+'?accessToken=' + contensis_token;
      const response_entry = await fetch(url_entry);
      let entry = await response_entry.json();
      console.log(entry);
      return entry;

    }

  }