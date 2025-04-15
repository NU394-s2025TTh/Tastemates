import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';

import App from './App';

describe('App homepage', () => {
  test('renders the welcome message', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );

    const welcomeText = screen.getByText('Welcome!');
    expect(welcomeText.textContent).toBe('Welcome!');
  });
});
// describe('counter tests', () => {
//   test('Counter should be 0 at the start', () => {
//     render(
//       <BrowserRouter>
//         <App />
//       </BrowserRouter>,
//     );
//     expect(screen.getByText('count is: 0')).toBeDefined();
//   });

// test('Counter should increment by one when clicked', async () => {
//   render(
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>,
//   );
//   const counter = screen.getByRole('button');
//   fireEvent.click(counter);
//   expect(await screen.getByText('count is: 1')).toBeDefined();
// });
// });
