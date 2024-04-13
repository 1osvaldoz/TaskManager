import { Component } from "react";
import { connect } from "react-redux";
import { actions } from "../store";
import "./Home.css";
class Home extends Component {
  constructor() {
    super();
  }
  componentDidMount() {
    this.getData();
  }
  getData = async () => {
    await this.props.onLoad();
  };
  render() {
    return (
      <div className="Home__container">
        <h1>Bienvenido!</h1>
        <h3>Total de tareas: {this.props.tasks.length}</h3>
        <h3>
          Tareas completadas:{" "}
          {this.props.tasks.filter((x) => x.completed == 1).length}
        </h3>
        <h5>
          La siguiente aplicacion esta hecha para el manejo y control de tiempo
          de realizacion de tareas.
          <br />
          La aplicación consta de tres páginas principales:
          <br />
          - En la pagina actual se muestra el total de tareas y las tareas
          completadas.
          <br />- En <b><a href="/UpdateTask">Lista de Tareas</a></b> permite la gestión activa de tareas,
          con la capacidad de iniciar una tarea a la vez, un cronómetro
          regresivo y la opción de arrastrar y soltar para reorganizar tareas.
          <br />- En <b><a href="/CompleteTasks">Tareas Completadas</a></b> muestra un registro de tareas
          completadas con detalles y tiempo empleado. En resumen, la aplicación
          proporciona una experiencia eficiente para la gestión de tareas y
          seguimiento de productividad.
        </h5>
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
      const newTask2 = { description: "Hello Mars" };
      dispatch(actions.addTask(newTask2));
    },
    async onLoad() {
      const { data, error } = await actions.getTasks();
      dispatch(actions.loadTasks(data));
    },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Home);
