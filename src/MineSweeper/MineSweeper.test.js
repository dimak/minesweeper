import React from 'react';
import ReactDOM from 'react-dom';
import App from './MineSweeper';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MineSweeper />, div);
});
