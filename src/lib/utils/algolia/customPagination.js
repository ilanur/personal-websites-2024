import { connectPagination } from 'instantsearch.js/es/connectors';
// Create the render function
const renderPagination = (renderOptions, isFirstRender) => {
  const {
    pages,
    page,
    currentRefinement,
    nbPages,
    isFirstPage,
    isLastPage,
    nbHits,
    hitsPerPage,
    refine,
    createURL,
  } = renderOptions;
  
  const container = document.querySelector('#pagination');
  
  container.innerHTML = `
    <div class="flex items-center justify-between px-4 py-3 sm:px-6">
      <div class="flex flex-1 justify-between sm:hidden">
        <a href="#" class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</a>
        <a href="#" class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Next</a>
      </div>
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing
          <span class="font-medium">1</span>
          to
          <span class="font-medium">10</span>
          of
          <span class="font-medium">${nbHits}</span>
          results
          </p>
        </div>
        <div>
          <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            ${ !isFirstPage ?  
              `
              <a href="${createURL(0)}"  data-value="${0}" class="relative inline-flex items-center rounded-l-md px-2 py-2 bg-white text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-eui-blue hover:text-white focus:z-20 focus:outline-offset-0">
                <span class="sr-only">First page</span>
                <span class="fa-regular fa-angles-left"></span>
              </a>              
              <a href="${createURL(currentRefinement - 1)}" data-value="${currentRefinement - 1}" class="relative inline-flex items-center px-2 py-2 bg-white text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-eui-blue hover:text-white focus:z-20 focus:outline-offset-0">
                <span class="sr-only">Previous page</span>
                <span class="fa-regular fa-angle-left"></span>
              </a>
              `
              : ''
            }
            ${pages
              .map(
                page => 
                  `
                    <a href="${createURL(page)}" data-value="${page}" class="relative inline-flex items-center px-4 py-2 text-sm bg-white text-gray-900 ${currentRefinement === page ? 'text-eui-blue font-bold' : ''} ring-1 ring-inset ring-gray-300 hover:bg-eui-blue hover:text-white focus:z-20 focus:outline-offset-0">
                      ${page + 1}
                    </a>
                  `
                ).join('')
            }
            ${
              !isLastPage
                ? `
                <a href="${createURL(currentRefinement + 1)}" data-value="${currentRefinement + 1}" class="relative inline-flex items-center px-2 py-2 bg-white text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-eui-blue hover:text-white focus:z-20 focus:outline-offset-0">
                  <span class="sr-only">Next page</span>
                  <span class="fa-regular fa-angle-right"></span>
                </a>
                <a href="${createURL(nbPages - 1)}"  data-value="${nbPages - 1}" class="relative inline-flex items-center rounded-r-md px-2 py-2 bg-white text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-eui-blue hover:text-white focus:z-20 focus:outline-offset-0">
                  <span class="sr-only">Last page</span>
                  <span class="fa-regular fa-angles-right"></span>
                </a>                  
                `
                : ''
            }
          </nav>
        </div>
    </div>
  `;
  
  [...container.querySelectorAll('a')].forEach(element => {
    element.addEventListener('click', event => {
      event.preventDefault();
      refine(event.currentTarget.dataset.value);
    });
  });
};

// Create the custom widget
export const customPagination = connectPagination(
  renderPagination
);