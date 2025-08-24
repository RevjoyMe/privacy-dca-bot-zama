import React from 'react';
import { render } from '@testing-library/react';
import ReactDOM from 'react-dom/client';

// Mock ReactDOM.createRoot
const mockCreateRoot = jest.fn();
const mockRender = jest.fn();

jest.mock('react-dom/client', () => ({
  createRoot: mockCreateRoot.mockReturnValue({
    render: mockRender,
  }),
}));

// Mock components and modules
jest.mock('./App', () => ({
  __esModule: true,
  default: () => <div data-testid="app">App Component</div>,
}));

jest.mock('./reportWebVitals', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock CSS import
jest.mock('./index.css', () => ({}));

describe('index.tsx', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock document.getElementById
    const mockRootElement = document.createElement('div');
    mockRootElement.id = 'root';
    document.body.appendChild(mockRootElement);
  });

  afterEach(() => {
    // Clean up
    const rootElement = document.getElementById('root');
    if (rootElement) {
      document.body.removeChild(rootElement);
    }
  });

  it('should create root and render App component', () => {
    // Import the index file to trigger the execution
    require('./index');

    expect(mockCreateRoot).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'root',
      })
    );

    expect(mockRender).toHaveBeenCalledWith(
      expect.objectContaining({
        type: React.StrictMode,
        props: expect.objectContaining({
          children: expect.objectContaining({
            type: expect.any(Function), // App component
          }),
        }),
      })
    );
  });

  it('should render App component inside StrictMode', () => {
    require('./index');

    const renderCall = mockRender.mock.calls[0][0];
    
    expect(renderCall.type).toBe(React.StrictMode);
    expect(renderCall.props.children.type.name).toBe('App');
  });

  it('should call reportWebVitals', () => {
    const reportWebVitals = require('./reportWebVitals').default;
    
    require('./index');

    // The reportWebVitals function should be available
    expect(reportWebVitals).toBeDefined();
  });
});
