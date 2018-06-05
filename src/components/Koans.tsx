import React from "react";
import { Koan } from "./Koan";
import { compose, withState, withHandlers } from "recompose";

function getCurrentKoanIndex() {
  const fromLocalstorage = localStorage.getItem("currentKoan");
  if (fromLocalstorage === null) {
    return 0;
  }
  return fromLocalstorage;
}

function saveCurrentKoanIndex(index) {
  localStorage.setItem("currentKoanIndex", index);
}

export const Koans = compose(
  withState("currentKoanIndex", "setCurrentKoanIndex", getCurrentKoanIndex()),
  withState("allKoansComplete", "setAllKoansComplete", false),
  withHandlers({
    onKoanComplete: props => () => {
      const nextKoansIndex = props.currentKoanIndex + 1;
      if (nextKoansIndex >= props.koans.length) {
        props.setAllKoansComplete(true);
      } else {
        saveCurrentKoanIndex(nextKoansIndex);
        props.setCurrentKoanIndex(nextKoansIndex);
      }
    }
  })
)(({ koans, currentKoanIndex, allKoansComplete, onKoanComplete }) => (
  <div className="koans">
    In koans {JSON.stringify(currentKoanIndex)}
    {allKoansComplete ? (
      <div className="koans__complete">Congratulations</div>
    ) : (
      <Koan {...koans[currentKoanIndex]} onComplete={onKoanComplete} />
    )}
  </div>
));
