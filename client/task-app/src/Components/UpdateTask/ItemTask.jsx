import React from "react";
import { Component } from "react";
import Countdown from "react-countdown";

import "./ItemTask.css";
class ItemTask extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const padToTwoDigits = (num) => {
      return num.toString().padStart(2, "0");
    };

    const convertMsToHHMMSS = (ms) => {
      let seconds = Math.floor(ms / 1000);
      let minutes = Math.floor(seconds / 60);
      let hours = Math.floor(minutes / 60);

      seconds = seconds % 60;
      minutes = minutes % 60;
      hours = hours % 24;

      seconds = padToTwoDigits(seconds);
      minutes = padToTwoDigits(minutes);
      hours = padToTwoDigits(hours);

      return `${hours}:${minutes}:${seconds}`;
    };
    return (
      <div
        className={`item__container ${
          this.props.item.started == 1
            ? this.props.item.completed == 1
              ? "completed"
              : "started"
            : ""
        } `}
      >
        <div className="btnContainer">
          {this.props.item.id > 0 && this.props.item.completed == 0 && (
            <a href="#">
              <i className="fa fa-arrows" aria-hidden="true" />
            </a>
          )}
          {this.props.item.started == 0 && (
            <button
              variant="success"
              onClick={() => {
                if (
                  this.props.item.title == "" ||
                  this.props.item.minutes == "" ||
                  this.props.item.description == ""
                ) {
                  alert("Es necesario llenar todos los campos");
                } else {
                  this.props.updateTask(this.props.item);
                }
              }}
            >
              <i className="fa fa-floppy-o" aria-hidden="true" />
            </button>
          )}
          {this.props.item.id > 0 &&
            this.props.item.started == 0 &&
            this.props.existsStarted == false && (
              <button
                onClick={async () => {
                  if (Number(this.props.item.minutes) > 0) {
                    await this.props.startTask({
                      ...this.props.item,
                      started: 1,
                    });
                    this.props.updateRow(1, "started", this.props.item.id);
                    const minutes = Number(this.props.item.minutes) * 1000 * 60;
                    this.props.updateRow(minutes, "Dif", this.props.item.id);
                  } else {
                    alert("Es necesario definir el tiempo");
                  }
                }}
              >
                <i className="fa fa-play-circle" aria-hidden="true" />
              </button>
            )}
          {this.props.item.id > 0 &&
            this.props.item.started == 1 &&
            this.props.item.completed == 0 && (
              <button
                onClick={async () => {
                  await this.props.completeTask({
                    ...this.props.item,
                    completed: 1,
                  });
                  this.props.updateRow(1, "completed", this.props.item.id);
                }}
              >
                <i className="fa fa-check-circle-o" aria-hidden="true" />
              </button>
            )}
          {this.props.FromCompleteSite ||
            (this.props.item.id > 0 && this.props.item.started == 0 && (
              <button
                onClick={async () => {
                  await this.props.deleteTask({
                    ...this.props.item,
                  });
                  this.props.updateRow(-1, "delete", this.props.item.id);
                }}
              >
                <i className="fa fa-trash-o" aria-hidden="true" />
              </button>
            ))}
        </div>
        <div>
          <h4>Titulo:</h4>
          <input
            value={this.props.item.title}
            className="form-control"
            disabled={!this.props.item.started == 0}
            onChange={(input) =>
              this.props.updateRow(
                input.target.value,
                "title",
                this.props.item.id
              )
            }
          />
          <br />
          <h4>Descripcion:</h4>
          <textarea
            className="form-control"
            disabled={!this.props.item.started == 0}
            value={this.props.item.description}
            onChange={(input) =>
              this.props.updateRow(
                input.target.value,
                "description",
                this.props.item.id
              )
            }
          />
        </div>
        <div>
          <h4>Minutos:</h4>
          <input
            value={this.props.item.minutes}
            className="form-control"
            disabled={!this.props.item.started == 0}
            onChange={(input) =>
              this.props.updateRow(
                input.target.value,
                "minutes",
                this.props.item.id
              )
            }
          />
        </div>
        {this.props.item.Dif > 0 && this.props.item.completed == 0 && (
          <div>
            <h4>Tiempo Restante:</h4>
            <Countdown date={Date.now() + Number(this.props.item.Dif)}>
              <>Tiempo!</>
            </Countdown>
          </div>
        )}
        {this.props.item.completedTime > 0 && (
          <div>
            <h4>Tiempo Completado</h4>
            {convertMsToHHMMSS(Number(this.props.item.completedTime))}
          </div>
        )}
        {this.props.FromCompleteSite && (
          <button
          className="btnEliminar"
            onClick={async () => {
              await this.props.deleteTask({
                ...this.props.item,
              });
              this.props.updateRow(-1, "delete", this.props.item.id);
            }}
          >
            <i className="fa fa-trash-o" aria-hidden="true" />
          </button>
        )}
      </div>
    );
  }
}
export default ItemTask;
