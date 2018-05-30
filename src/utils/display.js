import hljs from 'highlight.js';

/**
 * returns an highlighted html for given code string
 * @param {string} language one of the languages supported by highlightjs
 * @param {string} code the code to highlight
 */
export function highlightCode(language, code) {
	return hljs.highlight(language, code).value;
}
