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
    FORMAT DATE
##################################################################################################    
*/
export function formatDate(isoString, showHour = false, longMonth = false) {
	let options
	let monthFormat = 'numeric'
	if (longMonth) {
		monthFormat = 'long'
	}
	if (showHour) {
		options = {
			year: 'numeric',
			month: monthFormat,
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric'
		}
	} else {
		options = {
			year: 'numeric',
			month: monthFormat,
			day: 'numeric'
		}
	}
	return new Date(isoString).toLocaleDateString('en-GB', options)
}

/*
##################################################################################################
    FORMAT TIME
##################################################################################################    
*/
export function formatTime(isoString) {
	//console.log('isoString', isoString); //isoString 00:30:00
	//return isoString;
	//remove the seconds
	let time = isoString.split(':')
	time.pop()
	time = time.join(':')
	//console.log('time', time); //time 00:30
	return time
}

/*
##################################################################################################
    GET TIME FROM DATE
##################################################################################################    
*/
export function getTimeFromDate(isoString) {
	const time = new Date(isoString).toLocaleTimeString('en', {
		timeStyle: 'short',
		hour12: false
	})
	return time
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
