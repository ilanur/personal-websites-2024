import { parseStringPromise } from 'xml2js'

export async function load() {
	const cadmus_author = 'CALZOLARI'
	const url = `https://cadmus.eui.eu/search/select?q=*&fq=author:%22${cadmus_author}%22&fl=&rows=999&fl=title,author,dc.identifier.uri,dateIssued.year,citation,type,abstract,RelationIspartofseries,handle&sort=dc.date.issued_dt+desc`
	const response = await fetch(url)
	const data = await response.text()

	try {
		const result = await parseStringPromise(data, {
			trim: true,
			normalizeTags: true,
			explicitArray: false,
			ignoreAttrs: false
		})
		const docs = result.response?.result[0]?.doc || []
		const publications = Array.isArray(docs)
			? docs.map(transformDocToPublication)
			: [transformDocToPublication(docs)]
		return {
			props: { publications }
		}
	} catch (err) {
		console.error('Failed to parse XML:', err)
		// Implement more robust error handling as necessary
		return { props: { error: 'Failed to parse XML', errorMessage: err.message } }
	}
}

function transformDocToPublication(doc) {
	return {
		handle: doc.str?.find((s) => s.$.name === 'handle')?._,
		title: doc.arr?.find((a) => a.$.name === 'title')?.str,
		authors: doc.arr?.find((a) => a.$.name === 'author')?.str.join(', '),
		citation: doc.arr?.find((a) => a.$.name === 'citation')?.str,
		type: doc.arr?.find((a) => a.$.name === 'type')?.str,
		abstract: doc.arr?.find((a) => a.$.name === 'abstract')?.str,
		url: doc.arr?.find((a) => a.$.name === 'dc.identifier.uri')?.str,
		date: doc.str?.find((s) => s.$.name === 'dateIssued.year')?._,
		series: doc.arr?.find((a) => a.$.name === 'RelationIspartofseries')?.str
	}
}
