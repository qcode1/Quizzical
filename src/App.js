import Start from "./components/Start";
import Question from "./components/Question";
import BlueBlob from "./images/blobs-1.png";
import YellowBlob from "./images/blobs.png";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { shuffleArray, cleanText } from "./util";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Confetti from "react-confetti"

function App() {

  const [api, setApi] = useState([]);
  const [questions, setQuestions] = useState([])
  const [quiz, setQuiz] = useState({
    start: false,
    completed: false
  })

  /* Fetching the data from the API and setting the state of the api to the data. */
  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=10")
      .then(res => res.json())
      .then(data => setApi(data.results))
  }, [quiz.start])


  /**
   * It takes a question object, creates an array of objects with the incorrect answers, and then adds
   * the correct answer to the array
   * @param question - The question object from the API
   * @returns An object with the following properties:
   * id: a random string
   * category: the category of the question
   * type: the type of the question
   * difficulty: the difficulty of the question
   * question: the question
   * correct_answer: the correct answer
   * incorrect_answers: an array of incorrect answers
   * choices: an array of objects with the following properties:
   * id:
   */
  function generateQuestion(question) {
    const id = nanoid()
    var choices = question.incorrect_answers.map(ans => ({
      id: nanoid(),
      parent: id,
      title: ans,
      isSelected: false,
      isCorrect: false
    }))
    choices.push({
      id: nanoid(),
      parent: id,
      title: question.correct_answer,
      isSelected: false,
      isCorrect: true
    })
    return {
      id: id,
      category: question.category,
      type: question.type,
      difficulty: question.difficulty,
      question: question.question,
      correct_answer: question.correct_answer,
      incorrect_answers: question.incorrect_answers,
      choices: shuffleArray(choices)
    }
  }


  /**
   * The startQuiz function sets the start state to true
   */
  function startQuiz() {
    setQuiz(prevState => (
      {
        ...prevState,
        start: true,
      }
    ))
  }

  /* Checking to see if the quiz has started, and if it has, it is mapping through the api and
  generating a question for each question in the api. If the quiz has not started, it is setting the
  questions array to an empty array. */
  useEffect(() => {
    // console.log(quiz)
    if (quiz.start) {
      setQuestions(
        api.map(question => (
          generateQuestion(question)
        ))
      )
    } else {
      setQuestions([])
    }
  }, [quiz.start, api])

  /**
   * It takes an array of choices and a choiceId and returns a new array of choices with the choice
   * that matches the choiceId set to true
   * @param choices - an array of objects that contain the choices for the question
   * @param choiceId - the id of the choice that was selected
   */
  function updateChoice(choices, choiceId) {
    let arr = []
    arr = choices.map(choice => {
      return {
        ...choice,
        isSelected: choice.id === choiceId ? true : false
      }
    })
    return arr
  }

  /**
   * It takes in a questionId and a choiceId, and then it updates the state of the questions array by
   * mapping through it and finding the question with the matching questionId, and then updating the
   * choices array of that question by mapping through it and finding the choice with the matching
   * choiceId
   * @param questionId - the id of the question that was clicked
   * @param choiceId - the id of the choice that was selected
   */
  function selectAnswer(questionId, choiceId) {
    setQuestions(prevState => {
      return prevState.map(question => {
        if (question.id === questionId) {
          return {
            ...question,
            choices: updateChoice(question.choices, choiceId)
          }
        } else {
          return question
        }
      })
    })
  }




  /**
   * It takes in an array of questions and an array of choices, and returns the number of correct
   * answers
   * @param questions - an array of objects that contain the questions and the correct answer
   * @param foundChoices - an array of objects that contains the user's choices
   * @returns The number of correct answers
   */
  function getScore(questions, foundChoices) {
    let count = 0
    for (let i = 0; i < questions.length; i++) {
      let currentQuestion = questions[i]
      let result = foundChoices.filter(choice => choice.parent === currentQuestion.id)[0]

      if (currentQuestion.correct_answer === result.title) {
        count++
      }

      // console.log(`Chosen Answer : ${currentQuestion.correct_answer}   |   Correct Answer : ${result.title}`)
    }
    // console.log(count)
    return count
  }

  function checkAnswers(questions) {

    let foundChoices = []
    for (let i = 0; i < questions.length; i++) {
      let currentQuestion = questions[i]
      // console.log(currentQuestion)

      let result = currentQuestion.choices.filter(choice => choice.isSelected === true)

      if (result.length !== 0) {
        foundChoices.push(currentQuestion.choices.filter(choice => choice.isSelected === true)[0])
      }
    }

    if (foundChoices.length === 10) {
      const finalScore = getScore(questions, foundChoices)

      setQuiz(prevState => ({
        ...prevState,
        completed: true
      }))

      toast.success(`✅ Quiz Completed!\nYou scored ${finalScore}/10!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

    } else {
      toast.error('❗️ Quiz Not Completed!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

  }


  function restartQuiz() {

    fetch("https://opentdb.com/api.php?amount=10")
      .then(res => res.json())
      .then(data => setApi(data.results))

    setQuiz(prevState => (
      {
        completed: false,
        start: true,
      }
    ))
    setQuestions([])
  }

  function exitQuiz() {
    setQuiz(prevState => (
      {
        completed: false,
        start: false,
      }
    ))
    setQuestions([])
  }


  const allQuestions = questions.map((question) =>

    <Question
      key={question.id}
      id={question.id}
      title={cleanText(question.question)}
      correct_answer={question.correct_answer}
      incorrect_answers={question.incorrect_answers}
      difficulty={question.difficulty}
      choices={question.choices}
      selectAnswer={selectAnswer}
      quiz={quiz}
    />

  )

  return (
    <main className="App">
      { quiz.completed && <Confetti /> }
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
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
          {quiz.completed
            ?
            <div className="completed-btn-group">
              <button onClick={restartQuiz} className="check-answer">Play Again</button>
              <button onClick={exitQuiz} className="check-answer">Exit</button>
            </div>
            :
            <div className="ans-btn-group">
              <button onClick={() => checkAnswers(questions)} className="check-answer">Check Answers</button>
            </div>
          }


        </div>

      }
      <img className="blue-blob" src={BlueBlob} alt="Blue Blob"></img>
    </main>
  );
}

export default App;
