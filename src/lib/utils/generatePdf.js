import { jsPDF } from 'jspdf';

export default function generatePdf(fields) {
	const { title, subtitle, body, logo } = fields;
	const doc = new jsPDF(); // Default is A4
	const docWidth = doc.internal.pageSize.getWidth();
	const docHeight = doc.internal.pageSize.getHeight();
	const docMargin = 20;

	// Logo
	if (logo) {
		let width = 25;
		let height = width * logo.aspectRatio;

		// Set a max height to the image so it doesn't overlap the line.
		if (height > 30) {
			width = 20;
			height = width * logo.aspectRatio;
		}

		doc.addImage(logo.src, logo.fileType, docMargin, 20 - height / 2, width, height);
	} else {
		var img = new Image();
		img.src = '/logo-eui.png';

		doc.addImage(img.src, 'PNG', docMargin, 10, 22, 10);
	}

	// Title
	doc.setFontSize(24);
	doc.text(title, 55, 20);
	const titleHeight = doc.getTextDimensions(title);

	// Subtitle
	doc.setFontSize(14);
	doc.text(subtitle, 55, 20 + titleHeight.h);

	// Line
	doc.setDrawColor('#dedede');
	doc.line(docMargin, 40, docWidth - docMargin, 40);

	// Body
	doc.setTextColor('#4f4f4f');
	doc.setFontSize(12);

	const bodyMaxWidth = docWidth - 40;
	const lines = doc.splitTextToSize(body, bodyMaxWidth);
	let bodyYPos = 55;

	for (const line of lines) {
		doc.text(line, docMargin, bodyYPos);
		bodyYPos += 5.8;
	}

	// Footer
	const currentDate = new Date();
	const dateLocalized = currentDate.toLocaleString('en-GB', { month: 'long' });
	const formattedDate = `${currentDate.getDate()} ${dateLocalized} ${currentDate.getFullYear()}`;
	const footerText = `${formattedDate}`;
	const footerTextDimensions = doc.getTextDimensions(footerText);

	doc.setFontSize(10);
	doc.text(footerText, (docWidth - footerTextDimensions.w) / 2, docHeight - docMargin);

	// Save the document
	doc.save();
}
