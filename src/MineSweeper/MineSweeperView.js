import React, { Component } from 'react';
import { Button, Alert } from 'react-bootstrap';
import _ from 'lodash';
import PropTypes from 'prop-types';
import './MineSweeper.css';

const WIN = 1;
const FAIL = 0;

class MineSweeper extends Component {
  static propTypes = {
    field: PropTypes.arrayOf(
      PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        show: PropTypes.bool
      }))
    ),
    gameOver: PropTypes.bool,
    status: PropTypes.oneOf([WIN, FAIL]),
    elapsedTime: PropTypes.number,
    handleNewGame: PropTypes.func.isRequired,
    handleCellClick: PropTypes.func.isRequired,
    handleFlagMine: PropTypes.func.isRequired
  };

  static defaultProps = {
    field: [[0]],
    gameOver: false,
    status: FAIL,
    elapsedTime: 0
  };

  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div className="minesweeper-field text-center">
        {
          this.props.gameOver ? (
            this.props.status === WIN ? (<Alert bsStyle="success">Winner after {this.props.elapsedTime} seconds!</Alert>) :
            (<Alert bsStyle="danger">Game Over after {this.props.elapsedTime} seconds</Alert>)
          ) : (<Alert bsStyle="info">Elapsed Time: {this.props.elapsedTime}</Alert>)
        }
        {
          _.map(this.props.field, (rows, x) => (
            <div className='row' key={`row-${x}`}>
            {
              _.map(rows, (cell, y) => (
                <div
                  className={`cell cell-${cell.value}${cell.show ? ' cell-show' : ''}${cell.flag ? ' cell-flag' : ''}`}
                  key={`${x},${y}`}
                  onClick={(e) => this.props.handleCellClick(x, y)}
                  onContextMenu={(e) => { this.props.handleFlagMine(x, y); e.preventDefault(); }}>
                  <span>{cell.value}</span>
                </div>
              ))
            }
            </div>
          ))
        }
      </div>
    );
  }
}

export default MineSweeper;
