import express from "express"
import cors from "cors"
import {v4 as uuidv4} from "uuid"



class TaskFactory {
    constructor() {
        this.task = {
            "id": uuidv4(),
            "text": this._placeholderTaskText(),
            "color": "white",
            "done": false,
        }
        return this;
    }

    static fromExistingTask(task) {
        let factory = new TaskFactory;
        factory.task = task;
        return factory;
    }

    static fromUntestedObj(obj) {
        let factory = new TaskFactory;
        if (obj["id"] != false) { //id is false when creating a new task, a string when recreating an existing one.
            factory.task["id"] = obj["id"];
        }
        factory.setText(obj["text"]);
        factory.setDone(obj["done"]);
        factory.setColor(obj["color"]);
        return factory;
    }

    applyChanges(changes) {
        if (changes.done != null) this.setDone(changes.done);
        if (changes.text != null) this.setText(changes.text);
        if (changes.color != null) this.setColor(changes.color);
        return this;
    }

    setText(text) {
        this.task["text"] = text;
        return this;
    }

    setDone(isDone) {
        this.task["done"] = isDone;
        return this;
    }

    setColor(color) {
        this.task["color"] = color;
        return this;
    }

    getTask() {
        return this.task;
    }

    _placeholderTaskText() {
        return "Write text for the task."
    }
}



let taskList = [(new TaskFactory()).getTask()];
taskList = [
  { id: uuidv4(), text: 'Learn React Hooks', done: false, 'color': 'white' },
  { id: uuidv4(), text: 'Build a Todo App', done: true, 'color': 'white'},
  { id: uuidv4(), text: 'Deploy to Netlify', done: false, 'color': 'white'},
];
console.log(taskList);

const MAX_LIST_SIZE = 16;

const PORT = process.env.PORT || 3000;
const app = express();

//CORS means the backend *does* allow requests from other domains, although we allow just our front. 
// app.use(cors({
    // "origin": "https://nattaskmanager.vercel.app"
// }))
app.use(cors());
app.use(express.json()); //this parses body requests into json objects automatically


//CREATE
app.post('/tasks', (req, res) => {
    try {
        if (taskList.length >= MAX_LIST_SIZE) throw new Error("Task list already at max size.")
        let factory = new TaskFactory();
        taskList = [factory.getTask(), ...taskList];
        res.status(200).json(factory.getTask());
    } catch (err) {
        res.status(500).json({error: err})
    }
});

//READ
app.get('/tasks', (req, res) => {
    res.json(taskList);
});

//UPDATE
app.put('/tasks/:id', (req, res) => {
    try {
        console.log("body: ", req.body);
        const taskToUpdate = taskList.find(t => t.id === req.params.id);
        if (!taskToUpdate) {
            res.status(404).json({error: 'Couldn\'t find task with id: ' + req.params.id})
        }

        const factory = TaskFactory.fromExistingTask(taskToUpdate); //this creates a reference of the array element
        factory.applyChanges(req.body); //this updates the array element directly

        console.log("updated from put\n", taskList);
        res.status(200).json(factory.getTask());
    } catch (err) {
        console.log("error: ", err);
        throw new Error(err.message);
    }
});

//DELETE
app.delete('/tasks/:id', (req, res) => {
    taskList = taskList.filter((task) => {
        return task.id != req.params.id
    });
    res.status(200).json(taskList);
    console.log("updated from delete\n", taskList);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});