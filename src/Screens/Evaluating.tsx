import React, { useEffect } from "react";
import { RoundState } from "../App";
import { Button } from "../components/Button";
import { getScore, showNumber } from "../utils";

type Props = {
  lastLevel: boolean;
  roundState: RoundState;
  nextLevel: (score: number) => void;
  gameOver: (score: number | undefined) => void;
};

const EvaluatingScreen: React.FC<Props> = ({
  lastLevel,
  roundState,
  nextLevel,
  gameOver,
}) => {
  const { selectedValue, multiplier } = roundState;
  const score = getScore(selectedValue as number, multiplier);

  useEffect(() => {
    const audio = new Audio("../../public/evaluating.mp3");
    audio.loop = true;
    audio.play();

    return () => {
      audio.pause();
    };
  }, []);

  const timer = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (selectedValue !== "X") {
      timer.current = setTimeout(() => {
        nextLevel(score);
      }, 10000);
    }

    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, [selectedValue, nextLevel, score, timer]);

  const _bankAndQuit = () => {
    if (timer.current) clearTimeout(timer.current);
    gameOver(score);
  };

  return (
    <div className="flex flex-col gap-y-4 items-center">
      {selectedValue === "X" ? (
        <h1 className="text-red-400 text-lg font-semibold">You lost...</h1>
      ) : (
        <h1 className="text-green-400 text-lg font-semibold">
          {lastLevel ? "You won!" : "You survived!"}
        </h1>
      )}
      {selectedValue !== "X" ? (
        <>
          <h2>Round Score</h2>
          <p className="text-2xl font-bold mb-4">{showNumber(score)}</p>
          <p className="bg-teal-600 px-4 py-2 rounded-md shadow-md mt-[-1rem]">
            Cash out now to keep all your winnings <br /> or continue and risk
            half for higher rewards!
          </p>
        </>
      ) : (
        <p>Your final score is 50% of your current score.</p>
      )}
      <hr />
      {selectedValue === "X" ? (
        <Button variant="destructive" onClick={() => gameOver(undefined)}>
          Try Again
        </Button>
      ) : (
        <div
          className={`flex w-full items-center ${
            lastLevel ? "justify-center" : "justify-between"
          }`}
        >
          <CountdownTimer />
          <Button onClick={_bankAndQuit}>
            {lastLevel ? "End Game" : "Cash Out"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EvaluatingScreen;

const CountdownTimer = () => {
  const [countdown, setCountdown] = React.useState(10);
  const timer = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timer.current = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, []);

  return <p>Next Round begins in {countdown} second(s)</p>;
};
