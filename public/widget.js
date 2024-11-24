(function() {
  const container = document.createElement('div');
  container.id = 'chat-widget-container';
  container.style.position = 'fixed';
  container.style.bottom = '0px';
  container.style.right = '20px';
  container.style.width = '400px';
  container.style.zIndex = '999999';
  document.body.appendChild(container);

  const iframe = document.createElement('iframe');
  iframe.src = 'https://chatbot-sigma-flax.vercel.app';  // URL of the chatbot (Repo A)
  iframe.style.width = '100%';
  iframe.style.height = '75px';
  iframe.style.border = 'none';
  container.appendChild(iframe);

  // Listen to messages from the iframe to open/close the chatbot
  window.addEventListener('message', (event) => {
    if (event.origin === 'https://chatbot-sigma-flax.vercel.app') {
      if (event.data === 'open') {
        iframe.style.height = '600px';  // Open the chatbot
      } else if (event.data === 'close') {
        iframe.style.height = '100px';  // Close the chatbot
      }
    }
  });
})();
