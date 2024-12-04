import { PUBLIC_EUI_WEB } from '$env/static/public'

/*
##################################################################################################
   GET THUMBNAIL
##################################################################################################    
*/
export function getThumbnail(thumbnail, placeholder = '') {
	return thumbnail ? `${PUBLIC_EUI_WEB}${thumbnail.asset.sys.uri}` : placeholder
}

/*
##################################################################################################
    TRUNCATE STRING
##################################################################################################    
*/
export function truncateString(str, maxLength) {
	if (str.length > maxLength) {
		return str.substring(0, maxLength - 3) + '...'
	}
	return str
}
