import '@testing-library/jest-dom';
import React from 'react';

// Polyfill para TextEncoder/TextDecoder
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Mock de React para componentes
global.React = React;
