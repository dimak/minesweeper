import React, { Component } from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

class MineSweeperSettings extends Component {
  static propTypes = {
    fieldSize: PropTypes.array.isRequired,
    mineCount: PropTypes.number.isRequired,
    handleSettingsChange: PropTypes.func.isRequired,
    handleNewGame: PropTypes.func.isRequired
  }

  render() {
    return (
      <Form inline className="minesweeper-settings text-center" onChange={this.props.handleSettingsChange}>
        <FormGroup controlId="minesweeper-length">
          <ControlLabel>Length:</ControlLabel>
          <FormControl type="number" name="length" value={this.props.fieldSize[0]} />
        </FormGroup>
        <FormGroup controlId="minesweeper-width">
          <ControlLabel>Width:</ControlLabel>
          <FormControl type="number" name="width" value={this.props.fieldSize[1]} />
        </FormGroup>
        <FormGroup controlId="minesweeper-minecount">
          <ControlLabel>Mines:</ControlLabel>
          <FormControl type="number" name="minecount" value={this.props.mineCount} />
        </FormGroup>
        <Button bsStyle="primary" onClick={this.props.handleNewGame}>
          New Game
        </Button>
      </Form>
    );
  }
}

export default MineSweeperSettings;
