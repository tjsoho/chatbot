(function() {
    console.log('Widget script starting...');
    // Create container div
    const container = document.createElement('div');
    container.id = 'chat-widget-container';
    console.log('Container created:', container);
    document.body.appendChild(container);
    console.log('Container added to body');

    // Create and append iframe
    const iframe = document.createElement('iframe');
    iframe.src = 'https://chatbot-843foefd2-tjsohos-projects.vercel.app';
    console.log('iframe created with src:', iframe.src);
    iframe.style.position = 'fixed';
    iframe.style.bottom = '20px';
    iframe.style.right = '20px';
    iframe.style.width = '400px';
    iframe.style.height = '600px';
    iframe.style.border = 'none';
    iframe.style.zIndex = '999999';
    container.appendChild(iframe);
    console.log('iframe added to container');
})(); 