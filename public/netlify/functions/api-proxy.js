exports.handler = async (event, context) => {
    // CONFIGURATION
    const targetHost = '16.171.10.128:8081';
    const targetBaseUrl = `http://${targetHost}`;
    const allowedOrigin = 'https://kamaleshpandi.netlify.app/'; // The fake origin we send to backend

    // CORS HEADERS FOR THE BROWSER
    const responseHeaders = {
        'Access-Control-Allow-Origin': '*', // Allow ANY browser to talk to this proxy
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With', // Allow standard headers
        'Access-Control-Allow-Credentials': 'true'
    };

    // 1. HANDLE PREFLIGHT (OPTIONS) LOCALLY
    // If the browser is asking "Can I do this?", we say "YES" immediately.
    // We do NOT ask the backend, because the backend is being difficult.
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: responseHeaders,
            body: ''
        };
    }

    // 2. CONSTRUCT TARGET URL
    const urlObj = new URL(event.rawUrl);
    const path = urlObj.pathname;
    const queryString = urlObj.search;
    const targetUrl = `${targetBaseUrl}${path}${queryString}`;

    // 3. CONSTRUCT HEADERS FOR BACKEND (Stealth Mode)
    // We remove Origin and Referer completely. 
    // This often bypasses CORS filters because they only activate when an Origin header is present.
    const backendHeaders = {
        'Host': targetHost,
        'Accept': 'application/json, text/plain, */*',
        'User-Agent': 'Netlify-Proxy-Function'
    };

    // Pass through Authorization if present
    if (event.headers['authorization']) {
        backendHeaders['Authorization'] = event.headers['authorization'];
    }

    // Pass through Content-Type if present
    if (event.headers['content-type']) {
        backendHeaders['Content-Type'] = event.headers['content-type'];
    }

    console.log(`[Proxy] ${event.httpMethod} -> ${targetUrl}`);

    try {
        const response = await fetch(targetUrl, {
            method: event.httpMethod,
            headers: backendHeaders,
            body: (event.httpMethod !== 'GET' && event.httpMethod !== 'HEAD') ? event.body : undefined,
        });

        const data = await response.text();

        return {
            statusCode: response.status,
            body: data,
            headers: {
                ...responseHeaders, // Apply our loose CORS headers to the response
                'Content-Type': response.headers.get('content-type') || 'application/json'
            }
        };
    } catch (error) {
        console.error('Proxy Error:', error);
        return {
            statusCode: 502,
            body: JSON.stringify({ error: 'Proxy Connection Failed', details: error.message }),
            headers: {
                ...responseHeaders,
                'Content-Type': 'application/json'
            }
        };
    }
};
