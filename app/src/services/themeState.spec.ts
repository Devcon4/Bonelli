
// jsdom doesn't have matchMedia because it's new. Mock it for this test.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

import themeState from './themeState';

test('themeState should init', () => {
  expect(themeState.theme.getValue()).not.toBeUndefined();
});

test('themeState should set theme', () => {
  const obs = themeState.theme;

  themeState.setTheme('light');
  expect(obs.getValue()).toEqual('light');
  
  themeState.setTheme('dark');
  expect(obs.getValue()).toEqual('dark');
});

test('themeState should toggle theme', () => {
  const obs = themeState.theme;

  themeState.setTheme('dark');
  themeState.toggleTheme();

  expect(obs.getValue()).toEqual('light');
});