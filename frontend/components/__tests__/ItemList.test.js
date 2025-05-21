import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ItemList from '../ItemList';
import api from '../../api'; // Import the actual api to mock its methods

// Mock the api module
jest.mock('../../api');

describe('ItemList', () => {
  const mockItems = [
    { id: 1, name: 'Item 1', description: 'Description 1', user_id: 1 },
    { id: 2, name: 'Item 2', description: 'Description 2', user_id: 1 },
  ];

  beforeEach(() => {
    // Reset mocks before each test
    api.getItems.mockReset();
    api.createItem.mockReset();
    api.updateItem.mockReset();
    api.deleteItem.mockReset();
  });

  test('renders loading state initially', () => {
    api.getItems.mockReturnValue(new Promise(() => {})); // Keep it pending
    render(<ItemList />);
    expect(screen.getByText(/loading items.../i)).toBeInTheDocument();
  });

  test('renders items correctly after fetching', async () => {
    api.getItems.mockResolvedValue({ data: mockItems });
    render(<ItemList />);

    // Wait for items to be loaded and displayed
    await waitFor(() => {
      expect(screen.getByText(/item 1/i)).toBeInTheDocument();
      expect(screen.getByText(/description 1/i)).toBeInTheDocument();
      expect(screen.getByText(/item 2/i)).toBeInTheDocument();
      expect(screen.getByText(/description 2/i)).toBeInTheDocument();
    });
    
    expect(screen.queryByText(/loading items.../i)).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /item list/i})).toBeInTheDocument();
  });

  test('renders "No items found" message when no items are fetched', async () => {
    api.getItems.mockResolvedValue({ data: [] });
    render(<ItemList />);
    
    await waitFor(() => {
      expect(screen.getByText(/no items found. create one!/i)).toBeInTheDocument();
    });
    expect(screen.queryByText(/loading items.../i)).not.toBeInTheDocument();
  });

  test('displays error message if fetching items fails', async () => {
    api.getItems.mockRejectedValue(new Error('Failed to fetch'));
    render(<ItemList />);

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch items/i)).toBeInTheDocument();
    });
    expect(screen.queryByText(/loading items.../i)).not.toBeInTheDocument();
  });

  test('renders create item form', async () => {
    api.getItems.mockResolvedValue({ data: [] }); // Start with no items
    render(<ItemList />);
    
    await waitFor(() => { // Ensure initial loading is done
      expect(screen.getByRole('heading', { name: /create new item/i })).toBeInTheDocument();
    });
    
    expect(screen.getByLabelText(/name:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create item/i })).toBeInTheDocument();
  });
});
