import React from 'react';
import {} from 'react-dom';

import { highlightCode } from '../utils/display';
import { flatten } from 'lodash';

const AST_TYPES = {
	LINE: 'LINE',
	FRAGMENT: 'FRAGMENT',
	PLACEHOLDER: 'PLACEHOLDER'
};

// Components
const CodeLine = ({ children }) => <div className="code-line">Line: {children}</div>;

const CodeFragment = ({ children, language }) => (
	<div dangerouslySetInnerHTML={{ __html: highlightCode(language, children) }} className="code-fragment" />
);

const CodePlaceholder = (props) => <input className="code-placeholder" {...props} />;

// Tokenize

const tokenizeLine = ({ line, placeholderPattern }) => {
	// no significant information in the code string
	const significantBits = line.replace(/\s/g, '');
	if (significantBits === '') return [];

	// We try to split by placeholder
	const splitByPlaceholder = line.split(placeholderPattern);
	if (splitByPlaceholder.length === 1) {
		return [ { type: AST_TYPES.FRAGMENT, content: line } ];
	}
	const flattenSpec = flatten(
		splitByPlaceholder.map((fragment) => {
			console.log('fragment', JSON.stringify(fragment));
			return [
				{
					type: AST_TYPES.FRAGMENT,
					content: fragment
				},
				{ type: AST_TYPES.PLACEHOLDER }
			];
		})
	);
	return flattenSpec;
};

/**
 * Simple code parser that generates an ast for the given koan
 * @param {*} param0 
 */
const tokenize = ({ code, placeholderPattern }) =>
	code.split('\n').map((line) => ({
		type: AST_TYPES.LINE,
		content: tokenizeLine({ line, placeholderPattern })
	}));

export const KoanRenderer = ({ code, language = 'javascript', placeholderPattern = '#___', onPlaceholderChange }) => {
	const ast = tokenize({ code, language, placeholderPattern });
	console.log('ast', ast);
	return (
		<div className="koan__renderer">
			{ast.map((line, index) => (
				<CodeLine key={index}>
					{line.content &&
						line.content.map(
							(fragment) =>
								fragment.type === AST_TYPES.FRAGMENT ? (
									<CodeFragment language={language}>{fragment.content}</CodeFragment>
								) : (
									<CodePlaceholder onChange={onPlaceholderChange(fragment.index)} />
								)
						)}
				</CodeLine>
			))}
		</div>
	);
};
