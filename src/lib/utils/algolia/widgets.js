import { refinementList,menuSelect,toggleRefinement } from 'instantsearch.js/es/widgets';


export function eui_menuSelect(search, container, attribute, title, select_form_classes, limit = 25, sort = "name:asc"){
    search.addWidgets([
     menuSelect({
       container: container,
       attribute: attribute,
       limit: limit,
       sortBy: [sort],
       cssClasses: {
         select: `form-select rounded-0 mt-3 ${select_form_classes}` ,
         option: 'bg-white',
       },
       templates: {
         defaultOption: title,
       }
     }),
    ]);
 }
 
 export function eui_toggleRefinement(search, container, attribute, title){
   search.addWidgets([
     toggleRefinement({
       container: container,
       attribute: attribute,
       cssClasses:{
         checkbox: 'form-check-input'
       },
       templates: {
         labelText: function(item){
           if(item.count == null){
             return;
           }
           else{
             return title;
           }
         }
         
       },
     })
   ]);
 }
 
 export function eui_refinementList(search, container, attribute, limit, sort = 'name:asc', count_value = 'd-none', has_search = false, show_more = false){
   let searchableInput = "d-none";
   let showSearch = "false";
   if(has_search === true){
     searchableInput = "form-control form-control-lg mb-3 rounded-0";
     showSearch = "true";
   }
   search.addWidgets([
     refinementList({
       container: container,
       attribute: attribute,
       searchable: showSearch,
       limit: limit,
       showMore: show_more,
       sortBy: [sort],
       cssClasses: { 
           list: 'list-unstyled',
           label : 'form-check-label',
           labelText: '',
           count: count_value,
           item: 'mb-2 form-check',
           checkbox: 'form-check-input rounded-0',
           select: 'form-select form-select-lg rounded-0',
           option: 'bg-white',
           searchableSubmit: 'd-none',
           searchableReset: 'd-none',
           searchableInput: searchableInput
         },
         
     })
   ]);
 }
 
 