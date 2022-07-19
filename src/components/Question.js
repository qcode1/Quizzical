import React, { useEffect } from "react";
import { nanoid } from "nanoid";


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

    var allAnswers = props.allAnswers

    useEffect(() => {
        console.log(props.title)
    })

    const answerButtons = allAnswers.map(answer =>
        <button key={nanoid()} className="answer">{cleanText(answer)}</button>
    )

    return (
        
        <div className="question">
            <h1 className="question-title">{props.title}</h1>
            <div className="answer-group">
                {answerButtons}
            </div>
            <hr/>
        </div>
    )
}


export default Question;