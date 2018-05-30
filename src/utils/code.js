/**
 * utility function to process koans code
 */

/** find the number of whitespaces chars to remove in front of the code */
export function offsetOfWhiteSpacesCount(spaces = []) {
	return Math.min(...spaces.map((space) => space.length));
}

/** trim the n first chars for a given line */
export function trimNChars(charCount) {
	return (lines) => lines.map((line) => line.split('').splice(charCount).join(''));
}

/**
 * find the starting white spaces character for a given string
 * @param {*} str 
 */
export function findStartingSpaces(str) {
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
	const charCountToTrim = offsetOfWhiteSpacesCount(spacesBeforeSignificantCode);
	return trimNChars(charCountToTrim)(byLines);
}
