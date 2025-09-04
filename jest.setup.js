// Polyfill for the fetch API, required by libraries like Stripe and OpenAI
import 'whatwg-fetch';

// Polyfill for TextEncoder and TextDecoder which are not available in the JSDOM environment
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
