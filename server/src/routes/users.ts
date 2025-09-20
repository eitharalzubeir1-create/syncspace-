import { Router } from 'express';
import { supabase } from '../supabaseClient';
import { z } from 'zod';

const router = Router();

// Validation schemas
const followUserSchema = z.object({
  user_id: z.string().uuid('Invalid user ID'),
});

const updateProfileSchema = z.object({
  full_name: z.string().min(1, 'Full name is required').optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  avatar_url: z.string().url('Invalid avatar URL').optional(),
});

// Search users
router.get('/search', async (req, res) => {
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

    const { q: query, limit = '10' } = req.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const limitNum = parseInt(limit as string, 10);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 50) {
      return res.status(400).json({ error: 'Limit must be between 1 and 50' });
    }

    // Search in profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, avatar_url')
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
      .neq('id', user.id) // Exclude current user
      .limit(limitNum);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({ users: data });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
});

// Get user profile by ID
router.get('/:userId', async (req, res) => {
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

    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, avatar_url, created_at')
      .eq('id', userId)
      .single();

    if (error) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ user: data });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
});

// Follow a user
router.post('/follow', async (req, res) => {
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
    const validation = followUserSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validation.error.issues 
      });
    }

    const { user_id: targetUserId } = validation.data;

    if (targetUserId === user.id) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    // Check if already following
    const { data: existingFollow } = await supabase
      .from('followers')
      .select('id')
      .eq('follower_id', user.id)
      .eq('followed_id', targetUserId)
      .single();

    if (existingFollow) {
      return res.status(400).json({ error: 'Already following this user' });
    }

    // Create follow relationship
    const { data, error } = await supabase
      .from('followers')
      .insert({
        follower_id: user.id,
        followed_id: targetUserId,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({ 
      message: 'Successfully followed user',
      follow: data 
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
});

// Unfollow a user
router.delete('/follow/:userId', async (req, res) => {
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

    const { error } = await supabase
      .from('followers')
      .delete()
      .eq('follower_id', user.id)
      .eq('followed_id', userId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({ message: 'Successfully unfollowed user' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
});

// Get followers
router.get('/:userId/followers', async (req, res) => {
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

    const { data, error } = await supabase
      .from('followers')
      .select(`
        *,
        profiles!followers_follower_id_fkey (
          id,
          full_name,
          email,
          avatar_url
        )
      `)
      .eq('followed_id', userId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({ followers: data });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
});

// Get following
router.get('/:userId/following', async (req, res) => {
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

    const { data, error } = await supabase
      .from('followers')
      .select(`
        *,
        profiles!followers_followed_id_fkey (
          id,
          full_name,
          email,
          avatar_url
        )
      `)
      .eq('follower_id', userId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({ following: data });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
});

// Update profile
router.put('/profile', async (req, res) => {
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
    const validation = updateProfileSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validation.error.issues 
      });
    }

    const updateData = validation.data;

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({ profile: data });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
});

export default router;
