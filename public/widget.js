(function() {
    // Create container div
    const container = document.createElement('div');
    container.id = 'chat-widget-container';
    document.body.appendChild(container);

    // Create and append iframe
    const iframe = document.createElement('iframe');
    iframe.src = 'https://chatbot-843foefd2-tjsohos-projects.vercel.app';
    iframe.style.position = 'fixed';
    iframe.style.bottom = '20px';
    iframe.style.right = '20px';
    iframe.style.width = '400px';
    iframe.style.height = '600px';
    iframe.style.border = 'none';
    iframe.style.zIndex = '999999';
    container.appendChild(iframe);
})(); 