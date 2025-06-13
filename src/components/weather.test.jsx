import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Weather from './Weather';
import axios from 'axios';

jest.mock('axios');


test('renders search input and buttons', () => {
  render(<Weather />);
  expect(screen.getByPlaceholderText(/enter city/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /^search$/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /voice search/i })).toBeInTheDocument();
});

test('shows alert when search with empty input', () => {
  render(<Weather />);
  fireEvent.click(screen.getByRole('button', { name: /^search$/i }));
  expect(screen.getByText(/please enter a city name/i)).toBeInTheDocument();
});

