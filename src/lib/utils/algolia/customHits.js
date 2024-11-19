import { connectHits } from 'instantsearch.js/es/connectors';
// Create the render function
const renderHits = (renderOptions, isFirstRender) => {
  const { hits,banner, widgetParams } = renderOptions;

  const container = document.querySelector(widgetParams.container);
  const templateFunction = widgetParams.templateFunction;
  const custom_single_path = widgetParams.custom_single_path;
  const configTitle = widgetParams.configTitle;

  console.log('hits', hits);

  // Call the async templateFunction without awaiting it
  templateFunction(hits, custom_single_path, configTitle).then((template) => {
    container.innerHTML = template;
  }).catch((error) => {
    console.error('Error rendering template:', error);
  });
};
  
  // Create the custom widget
  export const customHits = connectHits(renderHits);  