import { Redis } from '@upstash/redis'
import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const redis = Redis.fromEnv()
const resend = new Resend(process.env.RESEND_API_KEY)

const RATE_LIMIT_WINDOW = 60 * 60 // 1 hour in seconds
const RATE_LIMIT_MAX_REQUESTS = 100

interface ContactFormData {
  name: string
  email: string
  message: string
}

function validateFormData(data: ContactFormData): string[] {
  const errors: string[] = []

  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long')
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Please provide a valid email address')
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters long')
  }

  if (data.message && data.message.length > 1000) {
    errors.push('Message must not exceed 1000 characters')
  }

  return errors
}

async function checkRateLimit(ip: string): Promise<boolean> {
  const key = `contact_form:${ip}`
  const current = await redis.get(key)

  if (!current) {
    await redis.setex(key, RATE_LIMIT_WINDOW, '1')
    return true
  }

  const count = parseInt(current as string)
  if (count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }

  await redis.incr(key)
  return true
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  return 'unknown'
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)

    if (ip !== 'unknown') {
      const allowed = await checkRateLimit(ip)
      if (!allowed) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { status: 429 }
        )
      }
    }

    const data: ContactFormData = await request.json()
    const errors = validateFormData(data)

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 })
    }

    const { error: emailError } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: [process.env.EMAIL_TO || 'nathan@example.com'],
      replyTo: data.email,
      subject: `Portfolio Contact: ${data.name}`,
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
      `,
    })

    if (emailError) {
      console.error('Email sending error:', emailError)
      return NextResponse.json(
        { error: 'Failed to send message. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Message sent successfully!' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
