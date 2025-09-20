import { Router } from 'express';
import { supabase } from '../supabaseClient';
import { z } from 'zod';

const router = Router();

// Validation schemas
const updateScheduleSchema = z.object({
  schedule_json: z.any().optional(),
  free_times: z.any().optional(),
});

// Get current user's schedule
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length)
      : undefined;

    if (!accessToken) {
      return res.status(401).json({ error: 'Missing Bearer token' });
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);
    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid user session' });
    }

    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      return res.status(400).json({ error: error.message });
    }

    // If no schedule exists, return empty schedule
    if (!data) {
      return res.json({ 
        schedule: {
          id: null,
          user_id: user.id,
          schedule_json: null,
          free_times: null,
          updated_at: null
        }
      });
    }

    return res.json({ schedule: data });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
});

// Update current user's schedule
router.put('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length)
      : undefined;

    if (!accessToken) {
      return res.status(401).json({ error: 'Missing Bearer token' });
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);
    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid user session' });
    }

    // Validate input
    const validation = updateScheduleSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validation.error.issues 
      });
    }

    const { schedule_json, free_times } = validation.data;

    // Check if schedule exists
    const { data: existingSchedule } = await supabase
      .from('schedules')
      .select('id')
      .eq('user_id', user.id)
      .single();

    let result;
    if (existingSchedule) {
      // Update existing schedule
      const { data, error } = await supabase
        .from('schedules')
        .update({
          schedule_json,
          free_times,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        return res.status(400).json({ error: error.message });
      }
      result = data;
    } else {
      // Create new schedule
      const { data, error } = await supabase
        .from('schedules')
        .insert({
          user_id: user.id,
          schedule_json,
          free_times,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        return res.status(400).json({ error: error.message });
      }
      result = data;
    }

    return res.json({ schedule: result });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
});

// Get schedule for a specific user (for finding common free times)
router.get('/user/:userId', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length)
      : undefined;

    if (!accessToken) {
      return res.status(401).json({ error: 'Missing Bearer token' });
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);
    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid user session' });
    }

    const { userId } = req.params;

    // Only return free_times for privacy (not full schedule)
    const { data, error } = await supabase
      .from('schedules')
      .select('free_times, updated_at')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      return res.status(400).json({ error: error.message });
    }

    if (!data) {
      return res.json({ 
        free_times: null,
        updated_at: null
      });
    }

    return res.json({ 
      free_times: data.free_times,
      updated_at: data.updated_at
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
});

export default router;
