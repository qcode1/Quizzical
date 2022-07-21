import React from "react";

function Answer(props) {
    let classname = "answer";
    if (props.quiz.completed) {

        if (props.isSelected && !props.isCorrect) {
           classname = "answer wrong"
        } else if (props.isCorrect) {
            classname = "answer correct"
        }

    } else {

        if (props.isSelected) {
            classname = "answer selected"
        }
    }

    return (
        <button onClick={props.selectAnswer} className={classname} >{props.title}</button>
    )

}


export default Answer;