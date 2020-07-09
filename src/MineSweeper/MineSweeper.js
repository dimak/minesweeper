import React, { Component } from 'react';
import _ from 'lodash';
import MineSweeperView from './MineSweeperView';
import MineSweeperSettings from './MineSweeperSettings';
import './MineSweeper.css';

const FIELDSIZE = [10, 10];
const MINECOUNT = 10;
const MINE = 'x';
const WIN = 1;
const FAIL = 0;

const generateMineField = ([fieldLength = 1, fieldWidth = 1]) => {
  const output = [];
  for(let i = 0; i < fieldLength; i++) {
    let row = [];
    for(let j = 0; j < fieldWidth; j++) {
      row.push({ value: 0, show: false, flag: false });
    }
    output.push(row);
  }
  return output;
};
const generateMines = ([fieldLength = 1, fieldWidth = 1], mineCount = 0) => {
  let x;
  let y;
  const mineHash = {};
  const mines = [];

  for(let i = 0; i < mineCount; i++) {
    const xy = [_.random(0, fieldLength - 1), _.random(0, fieldWidth - 1)];
    if (mineHash[xy]) { // coord already exists, get a new one
      i--;
      continue;
    } else {
      mineHash[xy] = true;
      mines.push(xy);
    }
  }

  return mines;
}

/**
 * @param {Array[]} field
 * @param {Number} x
 * @param {Number} y
 * @return {Number|undefined} count + 1 if count was within field, undefined if count does not exist
 */
const incrementCount = (field, x, y) =>
  typeof _.get(field, `[${x}][${y}].value`) === 'number' ? field[x][y].value + 1 : undefined;

const populateFieldWithMines = (field, mines) => {
  _.forEach(mines, ([x, y]) => {
    let tmpCount;
    let tmpX;
    let tmpY;

    // only update values if a truthy value returned; possible returns are 0 and undefined
    [ tmpX, tmpY ] = [ x - 1, y - 1];
    tmpCount = incrementCount(field, tmpX, tmpY);
    tmpCount ? field[tmpX][tmpY].value = tmpCount : null;

    tmpY += 1;
    tmpCount = incrementCount(field, tmpX, tmpY);
    tmpCount ? field[tmpX][tmpY].value = tmpCount : null;

    tmpY += 1;
    tmpCount = incrementCount(field, tmpX, tmpY);
    tmpCount ? field[tmpX][tmpY].value = tmpCount : null;

    //---
    [ tmpX, tmpY ] = [ x, y - 1];
    tmpCount = incrementCount(field, tmpX, tmpY);
    tmpCount ? field[tmpX][tmpY].value = tmpCount : null;

    field[x][y].value = MINE;

    tmpY += 2;
    tmpCount = incrementCount(field, tmpX, tmpY);
    tmpCount ? field[tmpX][tmpY].value = tmpCount : null;

    //---

    [ tmpX, tmpY ] = [ x + 1, y - 1];
    tmpCount = incrementCount(field, tmpX, tmpY);
    tmpCount ? field[tmpX][tmpY].value = tmpCount : null;

    tmpY += 1;
    tmpCount = incrementCount(field, tmpX, tmpY);
    tmpCount ? field[tmpX][tmpY].value = tmpCount : null;

    tmpY += 1;
    tmpCount = incrementCount(field, tmpX, tmpY);
    tmpCount ? field[tmpX][tmpY].value = tmpCount : null;
  });

  return field;
}

class MineSweeper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      field: [],  // {Array[]} counters of mines, representative of the field
      gameOver: false,
      fieldSize: FIELDSIZE,
      mineCount: MINECOUNT,
      status: null,
      elapsedTime: 0
    }

    this.nonMineCells = 0;
    this.visibleCellCount = 0;

    this.timer = null;

    this.handleCellClick = this.handleCellClick.bind(this);
    this.handleFlagMine = this.handleFlagMine.bind(this);
    this.handleNewGame = this.handleNewGame.bind(this);
    this.handleSettingsChange = this.handleSettingsChange.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.gameOver) {
      this.stopTimer();
    }
  }

  handleSettingsChange(e) {
    const input = e.target;
    this.setState(({ fieldSize, mineCount }) => {
      const newState = { fieldSize: _.clone(fieldSize), mineCount };
      switch (input.name) {
        case 'length':
          newState.fieldSize[0] = parseInt(input.value, 10);
          break;
        case 'width':
          newState.fieldSize[1] = parseInt(input.value, 10);
          break;
        case 'minecount':
          newState.mineCount = parseInt(input.value, 10);
          break;
      }

      return newState;
    });
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.setState(({ elapsedTime }) => ({ elapsedTime: elapsedTime + 1}));
    }, 1000);
  }

  stopTimer() {
    clearTimeout(this.timer);
  }

  handleNewGame() {
    const field = generateMineField(this.state.fieldSize);
    const mines = generateMines(this.state.fieldSize, this.state.mineCount);
    populateFieldWithMines(field, mines);

    this.nonMineCells = this.state.fieldSize[0] * this.state.fieldSize[1] - this.state.mineCount;
    this.visibleCellCount = 0;

    this.setState({
      field,
      gameOver: false,
      status: null,
      elapsedTime: 0
    });

    this.startTimer();
  }

  cellClickHelper(field, x, y) {
    if (!field[x][y].show) {
      field[x][y].show = true;
      this.visibleCellCount++;

      if (field[x][y].value === 0) {
        let hasCell;
        let tmpX;
        let tmpY;

        // only click the cells if a cell exists
        [ tmpX, tmpY ] = [ x - 1, y - 1];
        hasCell = _.get(field, `[${tmpX}][${tmpY}].value`, null);
        hasCell !== null ? this.cellClickHelper(field, tmpX, tmpY) : null;

        tmpY += 1;
        hasCell = _.get(field, `[${tmpX}][${tmpY}].value`, null);
        hasCell !== null ? this.cellClickHelper(field, tmpX, tmpY) : null;

        tmpY += 1;
        hasCell = _.get(field, `[${tmpX}][${tmpY}].value`, null);
        hasCell !== null ? this.cellClickHelper(field, tmpX, tmpY) : null;

        //---

        [ tmpX, tmpY ] = [ x, y - 1];
        hasCell = _.get(field, `[${tmpX}][${tmpY}].value`, null);
        hasCell !== null ? this.cellClickHelper(field, tmpX, tmpY) : null;

        tmpY += 2;
        hasCell = _.get(field, `[${tmpX}][${tmpY}].value`, null);
        hasCell !== null ? this.cellClickHelper(field, tmpX, tmpY) : null;

        //---

        [ tmpX, tmpY ] = [ x + 1, y - 1];
        hasCell = _.get(field, `[${tmpX}][${tmpY}].value`, null);
        hasCell !== null ? this.cellClickHelper(field, tmpX, tmpY) : null;

        tmpY += 1;
        hasCell = _.get(field, `[${tmpX}][${tmpY}].value`, null);
        hasCell !== null ? this.cellClickHelper(field, tmpX, tmpY) : null;

        tmpY += 1;
        hasCell = _.get(field, `[${tmpX}][${tmpY}].value`, null);
        hasCell !== null ? this.cellClickHelper(field, tmpX, tmpY) : null;
      }
    }
    return field;
  }

  /**
   *
   */
  handleCellClick(x, y) {
    this.setState(({ field, gameOver }) => {
      const newState = {};

      if (!gameOver) {
        newState.field = this.cellClickHelper(_.cloneDeep(field), x, y);
        if (field[x][y].value === MINE) {
          field[x][y].show = true;
          newState.gameOver = true;
        } else if (this.visibleCellCount === this.nonMineCells) {
          newState.gameOver = true;
          newState.status = WIN;
        }
      }

      return newState;
    })
  }

  handleFlagMine(x, y) {
    this.setState(({ field }) => {
      const newState = {};
      if (!field[x][y].show) {
        newState.field = _.cloneDeep(field);
        newState.field[x][y].flag = !newState.field[x][y].flag;
        return newState;
      }
    });
  }

  render() {
    const {
      field,
      elapsedTime,
      gameOver,
      status,
      fieldSize,
      mineCount
    } = this.state;

    const {
      handleNewGame,
      handleCellClick,
      handleFlagMine,
      handleSettingsChange
    } = this;

    return (
      <div className="minesweeper">
        <MineSweeperSettings {...{
          fieldSize,
          mineCount,
          handleNewGame,
          handleSettingsChange
        }} />
        <MineSweeperView {...{
          field,
          gameOver,
          elapsedTime,
          status,
          handleNewGame,
          handleCellClick,
          handleFlagMine
        }} />
      </div>
    );
  }
}

export default MineSweeper;
