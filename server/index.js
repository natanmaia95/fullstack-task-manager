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

    fromObj(obj) {
        if (obj["id"] != false) { //id is false when creating a new task, a string when recreating an existing one.
            this.task["id"] = obj["id"];
        }
        this.setText(obj["text"]);
        this.setDone(obj["done"]);
        this.setColor(obj["color"]);
    }

    setText(text) {
        this.task["text"] = text;
    }

    setDone(isDone) {
        this.task["done"] = isDone;
    }

    setColor(color) {
        this.task["color"] = color;
    }

    getTask() {
        return this.task;
    }

    _placeholderTaskText() {
        return "Write text for the task."
    }
}



let taskList = [(new TaskFactory()).getTask()];
console.log(taskList);


const PORT = process.env.PORT || 3000;
const app = express();

//CORS means the backend *does* allow requests from other domains, although we allow just our front. 
app.use(cors({
    "origin": "https://nattaskmanager.vercel.app"
}))



//endpoints
app.get('/tasks', (req, res) => {
    res.json(taskList);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});