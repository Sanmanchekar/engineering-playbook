import React, {useState} from 'react';
import styles from './styles.module.css';

export type QuizQuestion = {
  q: string;
  options: string[];
  answer: number;
  explanation?: string;
};

type Props = {
  title?: string;
  questions: QuizQuestion[];
};

export default function Quiz({title = 'Self-assessment', questions}: Props) {
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = Object.entries(selected).reduce((acc, [i, opt]) => {
    return acc + (questions[+i].answer === opt ? 1 : 0);
  }, 0);

  const reset = () => {
    setSelected({});
    setRevealed({});
    setSubmitted(false);
  };

  return (
    <div className={styles.quiz}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {submitted && (
          <div className={styles.score}>
            Score: <strong>{score}</strong> / {questions.length}
          </div>
        )}
      </div>

      {questions.map((question, qi) => {
        const userAnswer = selected[qi];
        const isRevealed = revealed[qi] || submitted;
        return (
          <div key={qi} className={styles.question}>
            <div className={styles.questionText}>
              <span className={styles.qNum}>Q{qi + 1}.</span> {question.q}
            </div>
            <div className={styles.options}>
              {question.options.map((opt, oi) => {
                const isSelected = userAnswer === oi;
                const isCorrect = question.answer === oi;
                let cls = styles.option;
                if (isRevealed) {
                  if (isCorrect) cls += ' ' + styles.correct;
                  else if (isSelected) cls += ' ' + styles.wrong;
                } else if (isSelected) {
                  cls += ' ' + styles.selected;
                }
                return (
                  <button
                    key={oi}
                    className={cls}
                    onClick={() => {
                      if (isRevealed) return;
                      setSelected({...selected, [qi]: oi});
                    }}
                    disabled={isRevealed}>
                    <span className={styles.optLetter}>{String.fromCharCode(65 + oi)}.</span> {opt}
                  </button>
                );
              })}
            </div>
            {isRevealed && question.explanation && (
              <div className={styles.explanation}>
                <strong>Why:</strong> {question.explanation}
              </div>
            )}
            {!isRevealed && userAnswer !== undefined && (
              <button
                className={styles.revealBtn}
                onClick={() => setRevealed({...revealed, [qi]: true})}>
                Reveal answer
              </button>
            )}
          </div>
        );
      })}

      <div className={styles.actions}>
        {!submitted ? (
          <button
            className={styles.submit}
            onClick={() => setSubmitted(true)}
            disabled={Object.keys(selected).length !== questions.length}>
            Submit all
          </button>
        ) : (
          <button className={styles.submit} onClick={reset}>
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
