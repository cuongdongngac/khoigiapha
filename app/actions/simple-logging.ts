"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies, headers } from "next/headers";

// Simple logging function - works with existing activity_logs table
export async function logAction(userId: string, action: string, entityType: string, entityId?: string, details?: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  try {
    // Get IP and user agent for existing table structure
    const headersList = await headers();
    const forwarded = headersList.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : headersList.get('x-real-ip') || '127.0.0.1';
    const userAgent = headersList.get('user-agent') || '';

    // Use existing table structure with ip_address and user_agent
    await supabase
      .from('activity_logs')
      .insert({
        user_id: userId,
        action: action,
        entity_type: entityType,
        entity_id: entityId || null,
        details: details || null,
        ip_address: ip,
        user_agent: userAgent
      });
    
    console.log(`Logged: ${action} ${entityType} by ${userId}`);
  } catch (error) {
    console.error('Logging failed:', error);
  }
}

// Helper functions
export async function logUserAction(userId: string, action: string, details?: string) {
  return logAction(userId, action, 'user', undefined, details);
}

export async function logPersonAction(userId: string, action: string, personId: string, details?: string) {
  return logAction(userId, action, 'person', personId, details);
}

export async function logEventAction(userId: string, action: string, eventId: string, details?: string) {
  return logAction(userId, action, 'event', eventId, details);
}

export async function logSystemAction(userId: string, action: string, details?: string) {
  return logAction(userId, action, 'system', undefined, details);
}
