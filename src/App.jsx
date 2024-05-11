import React from 'react';
import Die from './Die';
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';

export default function App() {
  const emojis = ['😈', '🧌', '👽', '🐲', '👻', '👹'];
  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);

  React.useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
    }
  }, [dice]);

  function generateNewDie() {
    const randomEmojiIndex = Math.ceil(Math.random() * emojis.length - 1);
    const randomEmoji = emojis[randomEmojiIndex];

    return {
      value: randomEmoji,
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  /**
   * Challenge: Allow the user to play a new game when the
   * button is clicked and they've already won
   */

  function rollDice() {
    if (!tenzies) {
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
    } else {
      setDice((oldDice) => allNewDice());
      setTenzies((oldTenzies) => !oldTenzies);
    }
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <main>
      <div className="overlay"></div>
      <div className="inner-content">
        {tenzies && <Confetti />}
        <h1 className="title">
          {tenzies ? 'Congratulations!' : 'Monsterzies'}
        </h1>
        <p className="instructions">
          {tenzies
            ? `You've won! If you want another round, click the button below.`
            : 'Roll until all monsters are the same. Click each monster to freeze it at its current value between spawns.'}
        </p>
        <div className="dice-container">{diceElements}</div>
        <button className="roll-dice" onClick={rollDice}>
          {tenzies ? 'New Game' : 'Spawn monsters!'}
        </button>
      </div>
    </main>
  );
}
