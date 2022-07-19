import React from "react";

function Start(props) {
    return (
        <div className="welcome">

            <h1 className="title">Quizzical</h1>
            <p className="description">An interactive quiz app for friends and family!</p>

            <button className="start-button" onClick={props.startQuiz}>
                Start quiz
            </button>

        </div>
    )
}


export default Start;