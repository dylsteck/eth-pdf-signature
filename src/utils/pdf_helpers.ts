import { PDFFont } from "pdf-lib";

export function wrapText(text: string, width: number, font: PDFFont): string[] {
    const chars = text.split('');
    let lines = [];
    let currentLine = '';
    for (const char of chars) {
        const widthOfCurrentLine = font.widthOfTextAtSize(currentLine + char, 8);
        if (widthOfCurrentLine < (width - 100) ) {
            currentLine += char;
        } else {
            lines.push(currentLine);
            currentLine = char;
        }
    }

    lines.push(currentLine);

    return lines;
}