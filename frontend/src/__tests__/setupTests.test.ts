// This file tests that the setupTests.ts file properly configures the test environment

describe('setupTests', () => {
  it('should have jest-dom matchers available', () => {
    // Test that jest-dom matchers are working
    const element = document.createElement('div');
    element.textContent = 'test content';
    document.body.appendChild(element);
    
    expect(element).toHaveTextContent('test content');
    expect(element).toBeInTheDocument();
    
    document.body.removeChild(element);
  });

  it('should have window.matchMedia mocked', () => {
    expect(window.matchMedia).toBeDefined();
    expect(typeof window.matchMedia).toBe('function');
    
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    expect(mediaQuery.matches).toBe(false);
    expect(mediaQuery.media).toBe('(max-width: 768px)');
  });

  it('should have ResizeObserver mocked', () => {
    expect(global.ResizeObserver).toBeDefined();
    expect(typeof global.ResizeObserver).toBe('function');
    
    const resizeObserver = new global.ResizeObserver(() => {});
    expect(resizeObserver.observe).toBeDefined();
    expect(resizeObserver.unobserve).toBeDefined();
    expect(resizeObserver.disconnect).toBeDefined();
  });

  it('should have IntersectionObserver mocked', () => {
    expect(global.IntersectionObserver).toBeDefined();
    expect(typeof global.IntersectionObserver).toBe('function');
    
    const intersectionObserver = new global.IntersectionObserver(() => {});
    expect(intersectionObserver.observe).toBeDefined();
    expect(intersectionObserver.unobserve).toBeDefined();
    expect(intersectionObserver.disconnect).toBeDefined();
  });

  it('should have fetch mocked', () => {
    expect(global.fetch).toBeDefined();
    expect(typeof global.fetch).toBe('function');
  });

  it('should have localStorage mocked', () => {
    expect(global.localStorage).toBeDefined();
    expect(global.localStorage.getItem).toBeDefined();
    expect(global.localStorage.setItem).toBeDefined();
    expect(global.localStorage.removeItem).toBeDefined();
    expect(global.localStorage.clear).toBeDefined();
  });

  it('should have sessionStorage mocked', () => {
    expect(global.sessionStorage).toBeDefined();
    expect(global.sessionStorage.getItem).toBeDefined();
    expect(global.sessionStorage.setItem).toBeDefined();
    expect(global.sessionStorage.removeItem).toBeDefined();
    expect(global.sessionStorage.clear).toBeDefined();
  });

  it('should allow localStorage operations', () => {
    global.localStorage.setItem('test-key', 'test-value');
    expect(global.localStorage.getItem('test-key')).toBe('test-value');
    
    global.localStorage.removeItem('test-key');
    expect(global.localStorage.getItem('test-key')).toBe(null);
  });

  it('should allow sessionStorage operations', () => {
    global.sessionStorage.setItem('test-key', 'test-value');
    expect(global.sessionStorage.getItem('test-key')).toBe('test-value');
    
    global.sessionStorage.removeItem('test-key');
    expect(global.sessionStorage.getItem('test-key')).toBe(null);
  });
});
