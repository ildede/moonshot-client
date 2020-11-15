import React from 'react';
import {render, screen} from '@testing-library/react';
import Place from "./Place";
import {Locations} from "../types/type";

test('renders location', () => {
  render(<Place place={Locations.Moon} username="testname"/>);
  const location = screen.getByText(/Moon/i);
  expect(location).toBeInTheDocument();
});
test('renders username', () => {
  render(<Place place={Locations.Moon} username="testname"/>);
  const user = screen.getByText(/testname/i);
  expect(user).toBeInTheDocument();
});
