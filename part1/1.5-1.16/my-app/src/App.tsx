import React, { useState } from 'react';

const anecdotes: string[] = [
  'If it hurts, do it more often.',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
  'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
  'The only way to go fast, is to go well.',
];


interface ButtonProps {
  handleClick: () => void;
  text: string;
}

const Button: React.FC<ButtonProps> = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
);

interface StatisticLineProps {
  text: string;
  value: string | number;
}

const StatisticLine: React.FC<StatisticLineProps> = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
);

interface StatisticsProps {
  good: number;
  neutral: number;
  bad: number;
}

const Statistics: React.FC<StatisticsProps> = ({ good, neutral, bad }) => {
  const total = good + neutral + bad;
  const average = total === 0 ? 0 : (good - bad) / total;
  const positivePercentage = total === 0 ? 0 : (good / total) * 100;

  if (total === 0) {
    return <p>No feedback given</p>;
  }

  return (
    <div>
      <h2>Statistics</h2>
      <table>
        <tbody>
          <StatisticLine text="Good" value={good} />
          <StatisticLine text="Neutral" value={neutral} />
          <StatisticLine text="Bad" value={bad} />
          <StatisticLine text="All" value={total} />
          <StatisticLine text="Average" value={average.toFixed(2)} />
          <StatisticLine text="Positive" value={`${positivePercentage.toFixed(2)}%`} />
        </tbody>
      </table>
    </div>
  );
};

const App: React.FC = () => {
  const [good, setGood] = useState<number>(0);
  const [neutral, setNeutral] = useState<number>(0);
  const [bad, setBad] = useState<number>(0);
  const [selected, setSelected] = useState<number>(0);
  const [votes, setVotes] = useState<number[]>(Array(anecdotes.length).fill(0));

  const handleGoodClick = (): void => setGood(good + 1);
  const handleNeutralClick = (): void => setNeutral(neutral + 1);
  const handleBadClick = (): void => setBad(bad + 1);

  const handleNextAnecdote = (): void => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length);
    setSelected(randomIndex);
  };

  const handleVote = (): void => {
    const copy = [...votes];
    copy[selected] += 1;
    setVotes(copy);
  };

  const getMostVotedAnecdote = (): { anecdote: string; votes: number } => {
    const maxVotes = Math.max(...votes);
    const mostVotedIndex = votes.indexOf(maxVotes);
    return {
      anecdote: anecdotes[mostVotedIndex],
      votes: maxVotes,
    };
  };

  const mostVoted = getMostVotedAnecdote();

  return (
    <div>
      <h1>Give Feedback</h1>
      <Button handleClick={handleGoodClick} text="Good" />
      <Button handleClick={handleNeutralClick} text="Neutral" />
      <Button handleClick={handleBadClick} text="Bad" />
      <Statistics good={good} neutral={neutral} bad={bad} />

      <div>
        <h1>Anecdote of the day</h1>
        <p>{anecdotes[selected]}</p>
        <p>Has {votes[selected]} votes</p>
        <Button handleClick={handleVote} text="Vote" />
        <Button handleClick={handleNextAnecdote} text="Next Anecdote" />
        <h2>Anecdote with most votes</h2>
        <p>{mostVoted.anecdote}</p>
        <p>Has {mostVoted.votes} votes</p>
      </div>
    </div>
  );
};

export default App;
