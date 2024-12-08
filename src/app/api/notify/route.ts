import Push from 'pushover-notifications';

export async function POST(request: Request): Promise<Response> {
  try {
    const { message, name, email } = await request.json();
    
    const userKey = process.env.PUSHOVER_USER_KEY;
    const appToken = process.env.PUSHOVER_APP_TOKEN;

    console.log('Vercel Environment Check:', {
      hasUserKey: !!userKey,
      userKeyLength: userKey?.length,
      hasAppToken: !!appToken,
      appTokenLength: appToken?.length,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV
    });

    if (!userKey || !appToken) {
      return new Response(
        JSON.stringify({ 
          error: 'Server configuration error',
          details: 'Missing credentials',
          debug: {
            hasUserKey: !!userKey,
            hasAppToken: !!appToken
          }
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