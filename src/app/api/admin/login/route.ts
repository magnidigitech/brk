import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    // Server-side authentication check (kept securely on server side)
    if (email === 'magnidigitech@gmail.com' && password === 'Magni@221299') {
      return NextResponse.json({ success: true, email })
    }
    
    return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Bad request' }, { status: 400 })
  }
}
