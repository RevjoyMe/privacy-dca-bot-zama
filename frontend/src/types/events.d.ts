// Event handler types for React components

declare module "react" {
  interface ChangeEvent<T = Element> {
    target: T & EventTarget;
  }
  
  interface MouseEvent<T = Element> {
    target: T & EventTarget;
  }
  
  interface FormEvent<T = Element> {
    target: T & EventTarget;
    preventDefault(): void;
  }
}

// Global event handler types
declare global {
  interface HTMLInputElement {
    value: string;
    checked?: boolean;
  }
  
  interface HTMLSelectElement {
    value: string;
  }
  
  interface Event {
    target: EventTarget | null;
    preventDefault(): void;
  }
  
  interface EventTarget {
    value?: string;
    checked?: boolean;
  }
}

export {};
