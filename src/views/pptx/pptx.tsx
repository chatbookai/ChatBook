import React from 'react';
import ReactDOM from 'react-dom';
import { Marp } from '@marp-team/marp-react';

const markdown = `
# My Presentation
---
## Slide 2
Some content here...
`;

ReactDOM.render(<Marp markdown={markdown} />, document.getElementById('root'));
