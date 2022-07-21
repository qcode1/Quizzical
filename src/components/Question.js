import React from "react";
import Answer from "./Answer";


function Question(props) {

    function cleanText(text) {
        return text
            .replace('#039;/g', "'")
            .replace('&#039;/g', "'")
            .replace("&quot;", '"')
            .replace("quot;", '"')
            .replace('&"', '"')
            .replace("&'", "'")
    }


    const answerButtons = props.choices.map((choice) =>
        <Answer
            key={choice.id}
            id={choice.id}
            isSelected={choice.isSelected}
            isCorrect={choice.isCorrect}
            title={cleanText(choice.title)} 
            selectAnswer={() => props.selectAnswer(choice.parent, choice.id)}
            parent={choice.parent}
            quiz={props.quiz}
        />
    )

    return (

        <div className="question">
            <h1 className="question-title">{props.title}</h1>
            <div className="answer-group">
                {answerButtons}
            </div>
            <hr />
        </div>
    )
}


export default Question;