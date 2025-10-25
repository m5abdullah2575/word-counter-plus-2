import type { VercelRequest, VercelResponse } from '@vercel/node';
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { contactMessages, insertContactMessageSchema } from '../shared/schema';
import { Resend } from 'resend';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const validatedData = insertContactMessageSchema.parse(req.body);
    
    const [newMessage] = await db
      .insert(contactMessages)
      .values(validatedData)
      .returning();

    if (resend && process.env.CONTACT_EMAIL) {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: process.env.CONTACT_EMAIL,
        subject: `New Contact Form Message: ${validatedData.subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${validatedData.name}</p>
          <p><strong>Email:</strong> ${validatedData.email}</p>
          <p><strong>Subject:</strong> ${validatedData.subject}</p>
          <p><strong>Message:</strong></p>
          <p>${validatedData.message}</p>
          <hr>
          <p><small>Submitted at: ${new Date().toLocaleString()}</small></p>
        `,
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Your message has been sent successfully!',
      id: newMessage.id 
    });

  } catch (error: any) {
    console.error('Contact form error:', error);
    
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid form data. Please check your inputs.',
        errors: error.errors 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message. Please try again.',
      error: error.message 
    });
  }
}
