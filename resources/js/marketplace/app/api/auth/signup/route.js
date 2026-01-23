// NextResponse removed;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
export async function POST(request) {
    try {
        const body = await request.json();
        // Forward to backend /v1/register endpoint
        const response = await fetch(`${API_BASE_URL}/v1/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        if (!response.ok) {
            return NextResponse.json(data, {
                status: response.status
            });
        }
        return NextResponse.json(data, {
            status: 200
        });
    } catch (error) {
        console.error('Signup API error:', error);
        return NextResponse.json({
            error: 'Failed to process signup request',
            message: error.message
        }, {
            status: 500
        });
    }
}
