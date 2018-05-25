import hljs from 'highlight.js';
import {} from 'highlight.js/';

/** find the number of whitespaces chars to remove in front of the code */
function commonWhiteSpacesCount(spaces) {
	return Math.min(...spaces.map((space) => space.length));
}

/** trim the n first chars for a given line */
const trimNChars = (charCount) => (lines) => lines.map((line) => line.split('').splice(charCount).join(''));

/**
 * find the starting white spaces character for a given string
 * @param {*} str 
 */
function findStartingSpaces(str) {
	const results = /^([\s ]+)/.exec(str);
	if (results) {
		return results[0];
	}
	return [];
}

/**
 * basic whitespaces cleaning on code
 * @param {*} code 
 */
export function cleanCode(code) {
	const byLines = code.split('\n').filter((line, index) => line !== '');
	const spacesBeforeSignificantCode = byLines.map(findStartingSpaces);
	const charCountToTrim = commonWhiteSpacesCount(spacesBeforeSignificantCode);
	return trimNChars(charCountToTrim)(byLines);
}

export function highlightCode(language, code) {
	return hljs.highlight(language, code).value;
}

export function codeWithPlaceholder(language, code) {}
