/*********************************************************************
                            IMPORTS
*********************************************************************/
import ChatWindow from './components/ChatWidget/ChatWindow';
import { createRoot } from 'react-dom/client';
import React from 'react';

/*********************************************************************
                            TYPES
*********************************************************************/
declare global {
  interface Window {
    ChatWidget?: typeof ChatWindow;
  }
}

/*********************************************************************
                            EMBED SCRIPT
*********************************************************************/
// Create container for the widget
const container = document.createElement('div');
container.id = 'sloane-chat-widget';
document.body.appendChild(container);

// Render the widget
const root = createRoot(container);
root.render(React.createElement(ChatWindow));