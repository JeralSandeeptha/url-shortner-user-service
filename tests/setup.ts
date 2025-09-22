// Optionally, mock console methods to keep test output clean
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (args && typeof args[0] === 'string' && args[0].includes('Jest did not exit one second after the test run')) {
      return;
    }
    originalConsoleError.call(console, ...args as []);
  };
  console.warn = (...args: unknown[]) => {
    originalConsoleWarn.call(console, ...args as []);
  };
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});
