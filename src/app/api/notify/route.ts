import Push from 'pushover-notifications';

export async function POST(request: Request): Promise<Response> {
  try {
    const { message, name, email } = await request.json();
    
    const userKey = process.env.PUSHOVER_USER_KEY;
    const appToken = process.env.PUSHOVER_APP_TOKEN;

    console.log('API Route Debug:', {
      hasUserKey: !!userKey,
      hasAppToken: !!appToken,
      userKeyLength: userKey?.length,
      appTokenLength: appToken?.length
    });

    if (!userKey || !appToken) {
      console.error('Missing Pushover credentials:', {
        userKeyExists: !!userKey,
        appTokenExists: !!appToken
      });
      return new Response(
        JSON.stringify({ 
          error: 'Server configuration error',
          details: 'Missing Pushover credentials'
        }), 
        { status: 500 }
      );
    }

    const push = new Push({
      user: userKey,
      token: appToken
    });

    return await new Promise<Response>((resolve) => {
      push.send({
        message: `New chat started by ${name} (${email})\nFirst message: ${message}`,
        title: 'New Chat Activity',
        sound: 'magic',
        priority: 1
      }, (err) => {
        if (err) {
          console.error('Pushover Error:', err);
          resolve(new Response(
            JSON.stringify({ 
              error: 'Failed to send notification',
              details: err.message 
            }), 
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
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { status: 500 }
    );
  }
} 