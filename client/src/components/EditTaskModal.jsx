import {useState} from "react"


function EditTaskModal({ref, task, onSave, onClose}) {
    if (task == null) return (<></>);

    const [tempTask, setTempTask] = useState({...task});

    return(
        <dialog ref={ref} onCancel={onClose} onClose={onClose}>
            <p>Edit Task</p>

            <div>
                <input type="text" value={tempTask.text} onChange={e => setTempTask({...tempTask, text: e.target.value})}/>
            </div>

            <div>
                <button onClick={onClose}>Cancel</button>
                <button onClick={() => onSave(tempTask)}>Save</button>
            </div>
            
        </dialog>
    );
};

export default EditTaskModal;