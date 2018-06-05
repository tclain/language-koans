/**
 * Koans are meant to be easily completable. This Simple Runner just match strings to check the user input
 */

import * as PropTypes from "prop-types";
import * as React from "react";
import { compose, withHandlers, withState } from "recompose";
import { KoanRenderer } from "./KoanRenderer";

const STATIC = {
  ENTER_KEY_CODE: 13
};

export const Koan = compose<any, any>(
  withState("userAnswers", "setUserAnswers", []),
  withState("answerError", "setAnswerError", false),
  withHandlers({
    onEnter: ({
      userAnswers,
      answers,
      onComplete,
      answerChecker,
      setAnswerError
    }) => () => {
      // check answers
      const userIsRight = answers.every((answer: any, index: any) => {
        return answerChecker(userAnswers[index], answer);
      });
      if (userIsRight) {
        if (onComplete) {
          onComplete();
        }
      } else {
        setAnswerError(true);
      }
    },
    /*
	* retrieve and store value for placeholder #position
	*/
    updateUserAnswer: ({ setUserAnswers, userAnswers }) => (
      position: number
    ) => (event: any) => {
      // retrieve value from event
      const value = event.target.value;
      // create a copy of answers;
      const newAnswers = [...userAnswers];
      // update answer at the correct position
      newAnswers[position] = value;
      // update new answers array
      setUserAnswers(newAnswers);
    }
  }),
  withHandlers({
    onKeyDown: ({ onEnter }) => (event: any) => {
      if (event.keyCode === STATIC.ENTER_KEY_CODE) {
        if (onEnter) {
          onEnter();
        }
      }
    }
  })
)(
  ({
    description,
    onComplete,
    code,
    answers,
    languageMode,
    userAnswers,
    answerError
  }) => (
    <div className="koan">
      {answerError && (
        <div className="koan__error">Oups, this is not the correct answer</div>
      )}
      <div className="koan__description">{description}</div>
      <KoanRenderer code={code} />
    </div>
  )
);

Koan.defaultProps = {
  languageMode: "javascript",
  placeholderString: "___",
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
