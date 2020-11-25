import React from 'react';
import {render, screen} from '@testing-library/react';
import Place from "./Place";

test('renders location', () => {
  render(<Place place="MOON" username="testname"/>);
  const location = screen.getByText(/Moon/i);
  expect(location).toBeInTheDocument();
});
test('renders username', () => {
  render(<Place place="MOON" username="testname"/>);
  const user = screen.getByText(/testname/i);
  expect(user).toBeInTheDocument();
});
