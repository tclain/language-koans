import React from 'react';
import { render } from 'react-dom';
import { Koans } from './components/Koans';
import koans from './koans';

const App = (props) => (
	<div>
		<Koans koans={koans} />
	</div>
);

render(<App />, document.getElementById('root'));
