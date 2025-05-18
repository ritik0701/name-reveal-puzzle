import React, { useState } from "react";
import { motion } from "framer-motion";

const TARGET_WORD = "SHIVED";
const WORD_LENGTH = 6;
const MAX_ATTEMPTS = 6;
const DICTIONARY_API = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const KEYBOARD_LAYOUT = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Enter", "Z", "X", "C", "V", "B", "N", "M", "⌫"]
];

const styles = {
  wordleContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    width: "100vw",
    backgroundColor: "#121213",
    color: "white",
    fontFamily: "Arial, sans-serif",
  },
  wordRow: {
    display: "flex",
    justifyContent: "center",
    margin: "5px",
  },
  wordCell: {
    width: "50px",
    height: "50px",
    margin: "3px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "bold",
    textTransform: "uppercase",
    border: "2px solid #3a3a3c",
    backgroundColor: "#121213",
    textAlign: "center",
  },
  correct: {
    backgroundColor: "#538d4e",
    borderColor: "#538d4e",
  },
  present: {
    backgroundColor: "#b59f3b",
    borderColor: "#b59f3b",
  },
  absent: {
    backgroundColor: "#3a3a3c",
    borderColor: "#3a3a3c",
  },
  keyboard: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    marginTop: "10px",
  },
  keyRow: {
    display: "flex",
    justifyContent: "center",
    gap: "5px",
  },
  key: {
    padding: "10px",
    backgroundColor: "#3a3a3c",
    color: "white",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    textTransform: "uppercase",
  },
  resetButton: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "18px",
    fontWeight: "bold",
    color: "white",
    backgroundColor: "#ff3b30",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

const WordleGame = () => {
  const [guesses, setGuesses] = useState(Array(MAX_ATTEMPTS).fill(""));
  const [attempt, setAttempt] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleKeyPress = (letter) => {
    if (gameOver || attempt >= MAX_ATTEMPTS) return;
    if (letter === "Enter") return handleSubmit();
    if (letter === "⌫") return handleBackspace();
    if (guesses[attempt].length >= WORD_LENGTH) return;
    const newGuesses = [...guesses];
    newGuesses[attempt] += letter;
    setGuesses(newGuesses);
  };

  const handleBackspace = () => {
    if (gameOver || attempt >= MAX_ATTEMPTS) return;
    const newGuesses = [...guesses];
    newGuesses[attempt] = newGuesses[attempt].slice(0, -1);
    setGuesses(newGuesses);
  };

  const handleSubmit = async () => {
    if (gameOver || guesses[attempt].length !== WORD_LENGTH) return;
    
    const word = guesses[attempt].toLowerCase();
    const isValid = await validateWord(word);

    if (guesses[attempt].toUpperCase() === TARGET_WORD) {
        setGameOver(true);
        alert("Congratulations! You guessed the name!");
        return;
      }
    
    if (!isValid) {
      alert("Not a valid word!");
      return;
    }
        
    if (attempt + 1 === MAX_ATTEMPTS) {
      setGameOver(true);
      alert(`Game Over! The name was ${TARGET_WORD}`);
    }
    setAttempt(attempt + 1);
  };

  const validateWord = async (word) => {
    try {
      const response = await fetch(`${DICTIONARY_API}${word}`);
      if (!response.ok) return false;
      return true;
    } catch (error) {
      return false;
    }
  };

  const checkGuess = (word) => {
    return word.split("").map((letter, index) => {
      if (letter === TARGET_WORD[index]) return "correct";
      if (TARGET_WORD.includes(letter)) return "present";
      return "absent";
    });
  };

  const resetGame = () => {
    setGuesses(Array(MAX_ATTEMPTS).fill(""));
    setAttempt(0);
    setGameOver(false);
  };

  return (
    <div style={styles.wordleContainer}>
      {guesses.map((word, rowIndex) => (
        <div key={rowIndex} style={styles.wordRow}>
          {[...Array(WORD_LENGTH)].map((_, letterIndex) => {
            const letter = word[letterIndex] || "";
            const status = rowIndex < attempt ? checkGuess(word)[letterIndex] : "";
            return (
              <motion.div
                key={letterIndex}
                style={{
                  ...styles.wordCell,
                  ...(status ? styles[status] : {}),
                  border: rowIndex === attempt ? "2px solid white" : "2px solid #3a3a3c",
                }}
              >
                {letter}
              </motion.div>
            );
          })}
        </div>
      ))}
      <div style={styles.keyboard}>
        {KEYBOARD_LAYOUT.map((row, rowIndex) => (
          <div key={rowIndex} style={styles.keyRow}>
            {row.map((letter) => (
              <button key={letter} style={styles.key} onClick={() => handleKeyPress(letter)}>
                {letter}
              </button>
            ))}
          </div>
        ))}
      </div>
      <button style={styles.resetButton} onClick={resetGame}>Reset</button>
    </div>
  );
};

export default WordleGame;
