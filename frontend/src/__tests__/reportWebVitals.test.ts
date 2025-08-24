import reportWebVitals from '../reportWebVitals';

// Mock web-vitals
const mockGetCLS = jest.fn();
const mockGetFID = jest.fn();
const mockGetFCP = jest.fn();
const mockGetLCP = jest.fn();
const mockGetTTFB = jest.fn();

jest.mock('web-vitals', () => ({
  getCLS: mockGetCLS,
  getFID: mockGetFID,
  getFCP: mockGetFCP,
  getLCP: mockGetLCP,
  getTTFB: mockGetTTFB,
}));

describe('reportWebVitals', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be a function', () => {
    expect(typeof reportWebVitals).toBe('function');
  });

  it('should call web vitals functions when callback is provided', () => {
    const mockCallback = jest.fn();
    
    reportWebVitals(mockCallback);

    expect(mockGetCLS).toHaveBeenCalledWith(mockCallback);
    expect(mockGetFID).toHaveBeenCalledWith(mockCallback);
    expect(mockGetFCP).toHaveBeenCalledWith(mockCallback);
    expect(mockGetLCP).toHaveBeenCalledWith(mockCallback);
    expect(mockGetTTFB).toHaveBeenCalledWith(mockCallback);
  });

  it('should not call web vitals functions when no callback is provided', () => {
    reportWebVitals();

    expect(mockGetCLS).not.toHaveBeenCalled();
    expect(mockGetFID).not.toHaveBeenCalled();
    expect(mockGetFCP).not.toHaveBeenCalled();
    expect(mockGetLCP).not.toHaveBeenCalled();
    expect(mockGetTTFB).not.toHaveBeenCalled();
  });

  it('should not call web vitals functions when callback is not a function', () => {
    reportWebVitals('not a function' as any);

    expect(mockGetCLS).not.toHaveBeenCalled();
    expect(mockGetFID).not.toHaveBeenCalled();
    expect(mockGetFCP).not.toHaveBeenCalled();
    expect(mockGetLCP).not.toHaveBeenCalled();
    expect(mockGetTTFB).not.toHaveBeenCalled();
  });

  it('should handle null callback', () => {
    reportWebVitals(null);

    expect(mockGetCLS).not.toHaveBeenCalled();
    expect(mockGetFID).not.toHaveBeenCalled();
    expect(mockGetFCP).not.toHaveBeenCalled();
    expect(mockGetLCP).not.toHaveBeenCalled();
    expect(mockGetTTFB).not.toHaveBeenCalled();
  });

  it('should handle undefined callback', () => {
    reportWebVitals(undefined);

    expect(mockGetCLS).not.toHaveBeenCalled();
    expect(mockGetFID).not.toHaveBeenCalled();
    expect(mockGetFCP).not.toHaveBeenCalled();
    expect(mockGetLCP).not.toHaveBeenCalled();
    expect(mockGetTTFB).not.toHaveBeenCalled();
  });

  it('should call all web vitals functions in correct order', () => {
    const mockCallback = jest.fn();
    
    reportWebVitals(mockCallback);

    expect(mockGetCLS).toHaveBeenCalledBefore(mockGetFID);
    expect(mockGetFID).toHaveBeenCalledBefore(mockGetFCP);
    expect(mockGetFCP).toHaveBeenCalledBefore(mockGetLCP);
    expect(mockGetLCP).toHaveBeenCalledBefore(mockGetTTFB);
  });
});
