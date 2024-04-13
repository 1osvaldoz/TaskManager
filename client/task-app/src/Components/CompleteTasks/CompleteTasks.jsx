import { Component } from "react";
import { connect } from "react-redux";
import { actions } from "../../store";
import ItemTask from "../UpdateTask/ItemTask";
import "./CompletedTask.css";

class CompletedTask extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.getData();
  }
  getData = async () => {
    await this.props.onLoad();
  };
  render() {
    return (
      <div className=" UpdateTask__container">
        <h2>Tareas Completadas</h2>
        {this.props.tasks.filter((x) => x.id >= 0 && x.completed == 1) && (
          <div className="noExistsTasks">
            <h1>Todavia no existen tareas completadas</h1>
          </div>
        )}
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
              existsStarted={true}
              FromCompleteSite={true}
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
export default connect(mapStateToProps, mapDispatchToProps)(CompletedTask);
