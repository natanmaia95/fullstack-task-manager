import React from "react"


function TaskCard({task, onDoneChanged}) {
    let taskDoneId = `taskDone-${task.id}`;

    return(
        <div>
            <input type="checkbox" id={taskDoneId} checked={task.done} onChange={(e) => onDoneChanged(task.id, e.target.checked)}></input>
            <label htmlFor={taskDoneId}>{task["text"]}</label>
            <br/>
            {/* <p>{task.done ? "done" : "not done"}</p> */}
        </div>
    );
};

export default TaskCard;