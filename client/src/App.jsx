import { useState, useEffect } from 'react'
import './App.css'
import TaskCard from './components/TaskCard';

let testTaskList = [
  { id: 'uuid1111', text: 'Learn React', done: false, 'color': 'white' },
  { id: 'uuid2222', text: 'Build a Todo App', done: true, 'color': 'white'},
  { id: 'uuid3333', text: 'Deploy to Render and Vercel', done: false, 'color': 'white'},
];

const BASE_SERVER_URL = 'http://localhost:3000'

function App() {
  console.log("TodoApp rendering");

  const [taskList, setTaskList] = useState([...testTaskList]);

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

  let handleTaskDoneChanged = async (id, newDoneValue) => {
    //update local first
    let oldTaskList = [...taskList];
    let tempList = taskList.map((task) =>
      task.id === id ? { ...task, done: newDoneValue } : task
    )
    setTaskList([...tempList]);
    console.log(taskList);

    //then send. if no response, revert
    try {
      const response = await fetch(BASE_SERVER_URL + `/tasks/${id}`, {
        method: 'PUT', headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({done: newDoneValue})
      })

      if (!response.ok) {
        setTaskList(oldTaskList); //revert state
        throw new Error(`HTTP error! status ${response.status}`);
      }
    } catch (err) {
      setError("Failed to update task. Please try again.\n" + err.message);
    }
  }

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>Error loading tasks: {error}</p>;

  return (
    <>
      <h1>Task Manager</h1>
      <div className="card">


        {taskList.map((taskIn) => {
          return <TaskCard 
            key={taskIn.id} task={taskIn}
            onDoneChanged={handleTaskDoneChanged}
          />
        })}
      </div>

    </>
  )
}

export default App
