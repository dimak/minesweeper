import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MineSweeper from './MineSweeper/MineSweeper';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<MineSweeper />, document.getElementById('root'));
registerServiceWorker();
