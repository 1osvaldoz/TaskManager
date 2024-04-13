import axios from "axios";

const ADD_TASK = "ADD_TASK";
const LOAD_TASKS = "LOAD_TASKS";
const UPDATE_ROW = "UPDATE_ROW";
const UPDATE_TABLE = "UPDATE_TABLE";

const initalState = {
  tasks: [{ id: 0, description: "", started: 0, completed: "0" }],
};
const requestAPI = async (params) => {
  const { url, method = "get", data = {}, headers = {} } = params;
  try {
    const fullUrl = `http://localhost:5000/${url}`;
    headers["Content-Type"] = "application/json";
    const response = await axios({
      method,
      headers,
      url: fullUrl,
      data,
    });

    return { error: "", data: response.data, status: "" };
  } catch (err) {
    if (err.message == "Network Error") alert("Error connection");
    return { error: err, data: "", status: err.response?.status };
  }
};
export const actions = {
  addTask(newTask) {
    return {
      type: ADD_TASK,
      newTask,
    };
  },
  loadTasks(tasks) {
    return {
      type: LOAD_TASKS,
      tasks,
    };
  },
  updateRow(task) {
    return {
      type: UPDATE_ROW,
      task,
    };
  },
  updateTable(table) {
    return {
      type: UPDATE_TABLE,
      table,
    };
  },
  getTasks: async function () {
    const params = {
      url: "Task",
      method: "GET",
    };
    return await requestAPI(params);
  },

  updateTask: async function (item) {
    const params = {
      url: "Task",
      method: "put",
      data: item,
    };
    return await requestAPI(params);
  },
  startTask: async function (item) {
    const params = {
      url: "StartTask",
      method: "put",
      data: item,
    };
    return await requestAPI(params);
  },
  completeTask: async function (item) {
    const params = {
      url: "CompleteTask",
      method: "put",
      data: item,
    };
    return await requestAPI(params);
  },
  deleteTask: async function (item) {
    const params = {
      url: "Task/" + item.id,
      method: "delete",
    };
    return await requestAPI(params);
  },
  updateOrder: async function (table) {
    const params = {
      url: "UpdateOrderTask",
      method: "put",
      data: table,
    };
    return await requestAPI(params);
  },
};
export function reducer(state = initalState, action) {
  switch (action.type) {
    case ADD_TASK: {
      let newTask = actions.addTask(action.newTask).newTask;
      return {
        ...state,
        tasks: [...state.tasks, newTask],
      };
    }
    case LOAD_TASKS: {
      return {
        ...state,
        tasks: action.tasks,
      };
    }
    case UPDATE_ROW: {
      let newArr = state.tasks;
      const index = newArr.findIndex((x) => x.id === action.task.id);
      if (action.task.field == "delete") {
        delete newArr[index];
      } else {
        if (index >= 0) {
          newArr[index][action.task.field] = action.task.value;
        } else {
          debugger
          let newItem={ id: -1, description: "", started: 0, completed: "0" }
          newItem[action.task.field] = action.task.value;
          newArr.push(newItem);
        }
      }
      return {
        ...state,
        tasks: [...newArr.filter((x) => x != null)],
      };
    }
    case UPDATE_TABLE: {
      return {
        ...state,
        tasks: [...action.table],
      };
    }
    default:
      return state;
  }
}
