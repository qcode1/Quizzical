import Start from "./components/Start";
import Question from "./components/Question";
import BlueBlob from "./images/blobs-1.png";
import YellowBlob from "./images/blobs.png";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";

function App() {

  const [questions, setQuestions] = useState([])
  const [quiz, setQuiz] = useState({
    start: false,
    completed: false
  })

  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=10")
      .then(res => res.json())
      .then(data => setQuestions(data.results))
  }, [])

  function startQuiz() {
    setQuiz(prevState => (
      {
        ...prevState,
        start: true,
      }
    ))
  }

  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {

      // Generate random number
      var j = Math.floor(Math.random() * (i + 1));

      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    return array;
  }

  const htmlEntities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;"
  };

  function cleanText(text) {
    return text
    .replaceAll(/(#039\;)/g, "\"")
    // .replace(/#039;/g, "'")
    .replaceAll(/&#039;/g, "'")
    .replaceAll(/(&quot\;)/g, '"')
    .replaceAll(/(&#quot\;)/g, '"')
    .replaceAll(/(&')/g, "\"")
    .replaceAll("/quot;/g", '"')
    .replaceAll('/&"/g', '"')
    .replaceAll("/&'/g", "'")
  }

  const allQuestions = questions.map((question) =>
    <Question
      key={nanoid()}
      title={question.question}
      correct_answer={question.correct_answer}
      incorrect_answers={question.incorrect_answers}
      difficulty={question.difficulty}
      allAnswers={shuffleArray(question.incorrect_answers.concat(question.correct_answer))}
    />
  )

  return (
    <main className="App">
      <img className="yellow-blob" src={YellowBlob} alt="Yellow Blob"></img>
      {
        quiz.start === false &&
        <Start
          startQuiz={startQuiz}
        />
      }
      {
        quiz.start === true &&
        <div className="container">
          {allQuestions}

          <div className="check-ans-group">
            <button className="check-answer">Check Answers</button>
          </div>
        </div>
      }
      <img className="blue-blob" src={BlueBlob} alt="Blue Blob"></img>
    </main>
  );
}

export default App;
