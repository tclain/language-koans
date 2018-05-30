/**
 * Koans are meant to be easily completable. This Simple Runner just match strings to check the user input
 */

import React from 'react';
import PropTypes from 'prop-types';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { highlightCode } from '../utils/display';
import { KoanRenderer } from './KoanRenderer';

const STATIC = {
	ENTER_KEY_CODE: 13
};

export const Koan = compose(
	withState('userAnswers', 'setUserAnswers', []),
	withState('answerError', 'setAnswerError', false),
	withHandlers({
		/**
         * retrieve and store value for placeholder #position
         */
		updateUserAnswer: ({ setUserAnswers, userAnswers }) => (position) => (event) => {
			// retrieve value from event
			const value = event.target.value;
			// create a copy of answers;
			const newAnswers = [ ...userAnswers ];
			// update answer at the correct position
			newAnswers[position] = value;
			// update new answers array
			setUserAnswers(newAnswers);
		},
		onEnter: ({ userAnswers, answers, onComplete, answerChecker, setAnswerError }) => () => {
			// check answers
			const userIsRight = answers.every((answer, index) => {
				return answerChecker(userAnswers[index], answer);
			});
			if (userIsRight) {
				if (onComplete) onComplete();
			} else {
				setAnswerError(true);
			}
		}
	}),
	withHandlers({
		onKeyDown: ({ onEnter }) => (event) => {
			if (event.keyCode === STATIC.ENTER_KEY_CODE) {
				if (onEnter) {
					onEnter();
				}
			}
		}
	}),
	lifecycle({
		componentWillMount() {
			document.addEventListener('keydown', this.props.onKeyDown);
		},
		componentWillUnmount() {
			document.removeEventListener('keydown', this.props.onKeyDown);
		}
	})
)(({ description, onComplete, code, answers, languageMode, userAnswers, answerError }) => (
	<div className="koan">
		{answerError && <div className="koan__error">Oups, this is not the correct answer</div>}
		<div className="koan__description">{description}</div>
		<KoanRenderer code={code} onPlaceholderChange={(index) => (e) => console.info(index, e)} />
	</div>
));

Koan.defaultProps = {
	languageMode: 'javascript',
	placeholderString: '___',
	answerChecker: (expected, provided) => expected === provided
};
Koan.propTypes = {
	/**
     * the description of the koan
     */
	description: PropTypes.string,
	/**
     * the language mode to use for syntax highlighting
     */
	languageMode: PropTypes.string,
	/** the callback to notify parent when the koans has been completed successfully */
	onComplete: PropTypes.func,
	/**
     * a template with the code to complete
     * 
     */
	code: PropTypes.string,
	/**
     * the placeholder symbol to use to identify a user answer
     */
	placeholderString: PropTypes.string,
	/**
     * a function used to assert that an answer is true
     * By default: strict equality
     */
	answerChecker: PropTypes.func,
	/**
     * an array of answers (in order) matching the named placeholder
     */
	answers: PropTypes.arrayOf(PropTypes.string)
};
