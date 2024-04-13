import { Component } from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { actions } from "../../store";
import ItemTask from "./ItemTask";
import ReactDragListView from "react-drag-listview";
import "./UpdateTask.css";

class UpdateTask extends Component {
  constructor(props) {
    super(props);

    const data = [];
    for (let i = 1, len = 7; i < len; i++) {
      data.push({
        title: `rows${i}`,
      });
    }

    this.state = {
      data,
      showNewTask: false,
    };
  }
  componentDidMount() {
    this.getData();
  }
  getData = async () => {
    await this.props.onLoad();
  };
  render() {
    const that = this;
    const dragProps = {
      onDragEnd(fromIndex, toIndex) {
        const data = [...that.props.tasks];
        const item = data.splice(fromIndex, 1)[0];
        data.splice(toIndex, 0, item);
        that.props.OnUpdateTable(data);
        actions.updateOrder(data);
      },
      nodeSelector: "li",
      handleSelector: "a",
    };
    const existsStarted = this.props.tasks.find(
      (x) => x.started == 1 && x.completed == 0
    )
      ? true
      : false;

    return (
      <div className=" UpdateTask__container">
        <h1>Tareas Pendientes</h1>
        <Button
          variant="success"
          type="submit"
          disabled={this.props.tasks.find((x) => x.id == -1) ? true : false}
          onClick={() => {
            this.props.onAddNewTast({
              id: -1,
              title: "",
              description: "",
              completed: 0,
              started: 0,
              minutes: 0,
              order: this.props.tasks.length,
            });
          }}
        >
          Agregar Tarea
        </Button>
        {this.props.tasks.find((x) => x.id == -1) && (
          <ItemTask
            item={this.props.tasks.find((x) => x.id == -1)}
            i={-1}
            updateTask={async (item) => {
              actions.updateTask(item);
              await this.props.onLoad();
            }}
            startTask={actions.startTask}
            completeTask={actions.completeTask}
            deleteTask={actions.deleteTask}
            updateRow={this.props.OnUpdateRow}
          />
        )}
        <ReactDragListView {...dragProps}>
          <ul className="ulTaskContainer">
            {this.props.tasks
              .filter((x) => x.id >= 0 && x.completed == 0)
              .map((item, i) => (
                <li key={`itemTaks${i}`}>
                  <ItemTask
                    item={item}
                    i={i}
                    updateTask={actions.updateTask}
                    startTask={actions.startTask}
                    completeTask={actions.completeTask}
                    deleteTask={actions.deleteTask}
                    updateRow={this.props.OnUpdateRow}
                    existsStarted={existsStarted}
                  />
                </li>
              ))}
          </ul>
        </ReactDragListView>
        <h2>Tareas Completadas</h2>
        {this.props.tasks
          .filter((x) => x.id >= 0 && x.completed == 1)
          .map((item, i) => (
            <ItemTask
              item={item}
              i={i}
              updateTask={actions.updateTask}
              startTask={actions.startTask}
              completeTask={actions.completeTask}
              deleteTask={actions.deleteTask}
              updateRow={this.props.OnUpdateRow}
              existsStarted={existsStarted}
            />
          ))}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    tasks: state.tasks,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    onAddNewTast(newTask) {
      dispatch(actions.addTask(newTask));
    },
    async onLoad() {
      const { data, error } = await actions.getTasks();
      dispatch(actions.loadTasks(data));
    },
    OnUpdateRow(value, field, id) {
      dispatch(actions.updateRow({ value, field, id }));
    },
    OnUpdateTable(table) {
      dispatch(actions.updateTable(table));
    },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(UpdateTask);
