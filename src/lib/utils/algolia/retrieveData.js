import { PUBLIC_ALGOLIA_KEY, PUBLIC_ALGOLIA_ID, PUBLIC_EUI_WEB} from '$env/static/public';

/**
 * Makes a request to Algolia to retrieve data based on the provided parameters.
 * @param {Object} params - The search parameters.
 * @returns {Promise<any>} - The search result from Algolia.
 */
export async function getAlgoliaData(params) {
    const { query, index, limit, isFacetFilter = false } = params;
    const requestUrl = `https://${PUBLIC_ALGOLIA_ID}-dsn.algolia.net/1/indexes/${index}/query`;
    
    const requestBody = {
        params: isFacetFilter ? `filters=${query}&hitsPerPage=${limit}` : `query=${query}&hitsPerPage=${limit}`
    };
  
    try {
      const response = await fetch(requestUrl, {
          method: 'POST',
          headers: {
            'X-Algolia-API-Key': PUBLIC_ALGOLIA_KEY,
            'X-Algolia-Application-Id': PUBLIC_ALGOLIA_ID,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
      });
  
      if (!response.ok) {
        // Handle non-2xx HTTP responses
        throw new Error(`Algolia API responded with ${response.status}: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data; // The deserialized JSON from Algolia
    } 
    catch (error) {
      console.error('Error fetching data from Algolia:', error);
      // Depending on your error handling strategy, you might want to throw the error,
      // return a default error object, or handle it in some other way.
      throw error;
    }
  }
  
  export async function getAlgoliaDataByUser(algoliaUser, index, limit) {
    const userEmail = algoliaUser.ict.EuiEmail;
    const userAffiliations = algoliaUser.ict.Affiliations;
    //get user groups based on the boolean values for isFellow etc
  
      const userGroups = [];
      if(algoliaUser.ict.IsAssistant){
          userGroups.push("Assistant");
      }
      if(algoliaUser.ict.IsFellow){
          userGroups.push("Fellow");
      }
      if(algoliaUser.ict.IsProfessor){
          userGroups.push("Professor");
      }
      if(algoliaUser.ict.IsStaff){
          userGroups.push("Staff");
      }
  
      const response = await fetch('/api/intranetFilters', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        index: index,
        limit: limit,
        userEmail: userEmail,
        affiliations : userAffiliations,
        groups : userGroups
      })
    });
  
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.hits;
  }
  

  export async function getAlgoliaDataByObjectId({ objectID, index }) {
  
    const requestUrl = `https://${PUBLIC_ALGOLIA_ID}-dsn.algolia.net/1/indexes/${index}/${objectID}`;
  
    try {
      const response = await fetch(requestUrl, {
        method: 'GET', // The method is GET for this request
        headers: {
          'X-Algolia-API-Key': PUBLIC_ALGOLIA_KEY,
          'X-Algolia-Application-Id': PUBLIC_ALGOLIA_ID,
        }
      });
  
      if (!response.ok) {
        // If the object is not found or any other error occurs, return a meaningful error
        return {
          status: response.status,
          body: {
            error: `Failed to fetch data for objectID ${objectID}: ${response.statusText}`
          }
        };
      }
  
      const data = await response.json();
  
      return data;
    } catch (error) {
      console.error(error);
  
      return {
        status: 500,
        body: {
          error: 'An unexpected error occurred.'
        }
      };
    }
  }

  export async function getAlgoliaDataByObjectIds({ objectIDs, index }) {
    // Define the request URL for fetching multiple objects
    const requestUrl = `https://${PUBLIC_ALGOLIA_ID}-dsn.algolia.net/1/indexes/*/objects`;
  
    // Prepare the request body
    const requestBody = {
      requests: objectIDs.map(objectID => ({
        indexName: index,
        objectID: objectID
      }))
    };
  
    try {
      // Make a POST request to Algolia API
      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Algolia-API-Key': PUBLIC_ALGOLIA_KEY,
          'X-Algolia-Application-Id': PUBLIC_ALGOLIA_ID,
        },
        body: JSON.stringify(requestBody)
      });
  
      if (!response.ok) {
        // If the server responds with an error, return a meaningful error
        return {
          status: response.status,
          body: {
            error: `Failed to fetch data: ${response.statusText}`
          }
        };
      }
  
      // Parse the JSON response
      const data = await response.json();
  
      return data;
    } catch (error) {
      console.error(error);
  
      return {
        status: 500,
        body: {
          error: 'An unexpected error occurred.'
        }
      };
    }
  }
  