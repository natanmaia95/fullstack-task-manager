import React from "react"


function TaskCard({task, onDoneChanged, onPressEdit, onDelete}) {
    let taskDoneId = `taskDone-${task.id}`;

    return(
        <div className="taskcard">
            <input type="checkbox" id={taskDoneId} checked={task.done} onChange={(e) => onDoneChanged(task.id, e.target.checked)}></input>
            <label htmlFor={taskDoneId}>{task["text"]}</label>
            <button onClick={() => onPressEdit(task)}>📝</button>
            <button onClick={() => onDelete(task.id)}>🗑️</button>
        </div>
    );
};

export default TaskCard;