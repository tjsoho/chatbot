import Push from 'pushover-notifications';

export async function POST(request: Request) {
  try {
    const { message, name, email } = await request.json();
    
    const userKey = process.env.PUSHOVER_USER_KEY;
    const appToken = process.env.PUSHOVER_APP_TOKEN;

    if (!userKey || !appToken) {
      console.error('Missing Pushover credentials');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }), 
        { status: 500 }
      );
    }

    const push = new Push({
      user: userKey,
      token: appToken
    });

    return new Promise((resolve) => {
      push.send({
        message: `New chat from ${name} (${email})\nFirst message: ${message}`,
        title: 'Sloane ChatBot',
        sound: 'cosmic',
        priority: 1
      }, (err) => {
        if (err) {
          console.error('Pushover Error:', err);
          resolve(new Response(
            JSON.stringify({ error: 'Failed to send notification' }), 
            { status: 500 }
          ));
        } else {
          resolve(new Response(
            JSON.stringify({ success: true }), 
            { status: 200 }
          ));
        }
      });
    });
  } catch (error) {
    console.error('Error in notification route:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { status: 500 }
    );
  }
} 