import { cleanCode, offsetOfWhiteSpacesCount, findStartingSpaces, trimNChars } from './code';

describe('trimNChars', () => {
	it('trim the first n chars of a string', () => {
		expect(trimNChars(2)([ 'hello', 'hella' ])).toEqual([ 'llo', 'lla' ]);
	});
});

describe('offsetOfWhiteSpacesCount', () => {
	it('should returns the lowest whitespace count', () => {
		expect(offsetOfWhiteSpacesCount([ ' \t\t', ' \t', ' \t' ])).toBe(2);
	});
});
