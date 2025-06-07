import { useState, useEffect, useRef } from 'react'
import './App.css'
import TaskCard from './components/TaskCard';
import EditTaskModal from './components/EditTaskModal';

let testTaskList = [
  { id: 'uuid1111', text: 'Learn React', done: false, 'color': 'white' },
  { id: 'uuid2222', text: 'Build a Todo App', done: true, 'color': 'white'},
  { id: 'uuid3333', text: 'Deploy to Render and Vercel', done: false, 'color': 'white'},
];

const BASE_SERVER_URL = process.env.BASE_SERVER_URL || 'http://localhost:3000';

function App() {
  console.log("TodoApp rendering");

  const [taskList, setTaskList] = useState([...testTaskList]);
  const [currentEditTask, setCurrentEditTask] = useState(null);
  const editModalRef = useRef();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(BASE_SERVER_URL + '/tasks');
        if (!response.ok) throw new Error(`HTTP error! status ${response.status}`);
        const data = await response.json();
        // console.log("data: ", data);
        setTaskList(data);

      } catch(err) {
        setError(err.message)
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []) //empty means run on-mount

  useEffect(() => {
    if (currentEditTask == null) {
      if (editModalRef.current) editModalRef.current.close();
    } else {
      if (editModalRef.current) editModalRef.current.showModal();
    }
  }, [currentEditTask]);


  let handleEditTask = async (id, changes) => {
    let oldTaskList = [...taskList];
    let tempList = taskList.map((task) =>
      task.id === id ? { ...task, ...changes } : task
    )
    setTaskList([...tempList]);
    console.log(taskList);

    //then send. if no response, revert
    try {
      const response = await fetch(BASE_SERVER_URL + `/tasks/${id}`, {
        method: 'PUT', headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(changes)
      })

      if (!response.ok) {
        setTaskList(oldTaskList); //revert state
        throw new Error(`HTTP error! status ${response.status}`);
      }
    } catch (err) {
      setError("Failed to update task. Please try again.\n" + err.message);
    }
  }

  let handleTaskDoneChanged = async (id, newDoneValue) => {
    let changes = {done: newDoneValue};
    await handleEditTask(id, changes);
  }

  let handleTaskEditModalSaved = async (newTask) => {
    let changes = {text: newTask.text, color: newTask.color}
    await handleEditTask(newTask.id, changes);
    setCurrentEditTask(null);
  }

  let handleDeleteTask = async (id) => {
    //delete on server first, on local later.
    try {
      const response = await fetch(BASE_SERVER_URL + `/tasks/${id}`, {
        method: 'DELETE', headers: {'Content-Type' : 'application/json'}
      })
      if (!response.ok) throw new Error(`HTTP error! status ${response.status}`);
      //if no error, delete the task
      setTaskList([...taskList.filter((task) => {return task.id !== id;})]);
    } catch (err) {
      setError("Failed to update task. Please try again.\n" + err.message);
    }
  }

  let handleCreateTask = async () => {
    try {
      const response = await fetch(BASE_SERVER_URL + `/tasks`, {
        method: 'POST', headers: {'Content-Type' : 'application/json'}
      })
      if (!response.ok) throw new Error(`HTTP error! status ${response.status}`);
      //if no error, add the task
      let newTask = await response.json();
      console.log("new task: ", newTask);
      setTaskList([newTask, ...taskList]);
    } catch (err) {
      setError("Failed to create task. Please try again.\n" + err.message);
    }
  }

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>Error loading tasks: {error}</p>;

  return (
    <>
      <h1>Task Manager</h1>
      <div className="card">
        <button onClick={handleCreateTask}>Create Task</button>

        {taskList.map((taskIn) => {
          return <TaskCard 
            key={taskIn.id} task={taskIn}
            onDoneChanged={handleTaskDoneChanged}
            onPressEdit={(taskToEdit) => setCurrentEditTask({...taskToEdit})}
            onDelete={handleDeleteTask}
          />
        })}

        {/* {currentEditTask == null ? null : (
          <EditTaskModal
          
          />
        )} */}
        <EditTaskModal
          ref={editModalRef}
          task={currentEditTask}
          onClose={() => setCurrentEditTask(null)}
          onSave={(newTask) => handleTaskEditModalSaved(newTask)}
        />
      </div>


    </>
  )
}

export default App
