import { connectPagination } from 'instantsearch.js/es/connectors';
// Create the render function
 const renderPagination = (renderOptions, isFirstRender) => {
    const {
      pages,
      currentRefinement,
      nbPages,
      isFirstPage,
      isLastPage,
      refine,
      createURL,
    } = renderOptions;
  
    const container = document.querySelector('#pagination');
  
    container.innerHTML = `
      <ul class="test-web">
        ${
          !isFirstPage
            ? `
              <li>
                <a
                  href="${createURL(0)}"
                  data-value="${0}"
                >
                  First
                </a>
              </li>
              <li>
                <a
                  href="${createURL(currentRefinement - 1)}"
                  data-value="${currentRefinement - 1}"
                >
                  Previous
                </a>
              </li>
              `
            : ''
        }
        ${pages
          .map(
            page => `
              <li>
                <a
                  href="${createURL(page)}"
                  data-value="${page}"
                  style="font-weight: ${currentRefinement === page ? 'bold' : ''}"
                >
                  ${page + 1}
                </a>
              </li>
            `
          )
          .join('')}
          ${
            !isLastPage
              ? `
                <li>
                  <a
                    href="${createURL(currentRefinement + 1)}"
                    data-value="${currentRefinement + 1}"
                  >
                    Next
                  </a>
                </li>
                <li>
                  <a
                    href="${createURL(nbPages - 1)}"
                    data-value="${nbPages - 1}"
                  >
                    Last
                  </a>
                </li>
                `
              : ''
          }
      </ul>
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
  
