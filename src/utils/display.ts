import { highlight } from "highlight.js";

/**
 * returns an highlighted html for given code string
 * @param {string} language one of the languages supported by highlightjs
 * @param {string} code the code to highlight
 */
export function highlightCode(language: string, code: string) {
  return highlight(language, code).value;
}
