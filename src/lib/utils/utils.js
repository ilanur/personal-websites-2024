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

/*
##################################################################################################
    BASE64 TO FILE
##################################################################################################    
*/
export function base64toFile(base64String) {
	const [mime, base64Content] = base64String.split(';base64,')
	const mimeType = mime.split(':')[1]
	const byteCharacters = atob(base64Content)
	const byteArrays = []

	for (let i = 0; i < byteCharacters.length; i++) {
		byteArrays.push(byteCharacters.charCodeAt(i))
	}

	const byteArray = new Uint8Array(byteArrays)
	const blob = new Blob([byteArray], { type: mimeType })
	const filename = generateUniqueFilename(mimeType)

	return new File([blob], filename, { type: mimeType })
}

function generateUniqueFilename(mimeType) {
	const timestamp = new Date().getTime()
	const random = Math.floor(Math.random() * 1000000)
	const extension = mimeType.split('/')[1]

	return `image_${timestamp}_${random}.${extension}`
}
