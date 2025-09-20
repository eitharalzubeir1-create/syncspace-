import { Router } from 'express';
import { supabase, getServiceRoleClient } from '../supabaseClient';
import { z } from 'zod';

const router = Router();

// Validation schemas
const createGroupSchema = z.object({
  group_name: z.string().min(1, 'Group name is required'),
});

const joinGroupSchema = z.object({
  group_id: z.string().uuid('Invalid group ID'),
});

// Get all groups for the current user
router.get('/', async (req, res) => {
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

    // Get groups where user is a member
    const { data, error } = await supabase
      .from('group_members')
      .select(`
        *,
        groups (
          id,
          group_name,
          created_at,
          created_by,
          creator_id
        )
      `)
      .eq('member_id', user.id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({ groups: data });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
});

// Create a new group
router.post('/', async (req, res) => {
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
    const validation = createGroupSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validation.error.issues 
      });
    }

    const { group_name } = validation.data;

    // Create group
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .insert({
        group_name,
        created_by: user.id,
        creator_id: user.id,
      })
      .select()
      .single();

    if (groupError) {
      return res.status(400).json({ error: groupError.message });
    }

    // Add creator as first member
    const { error: memberError } = await supabase
      .from('group_members')
      .insert({
        group_id: group.id,
        member_id: user.id,
        joined_at: new Date().toISOString(),
      });

    if (memberError) {
      return res.status(400).json({ error: memberError.message });
    }

    return res.status(201).json({ group });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
});

// Join a group
router.post('/join', async (req, res) => {
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
    const validation = joinGroupSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validation.error.issues 
      });
    }

    const { group_id } = validation.data;

    // Check if group exists
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .select('id, group_name')
      .eq('id', group_id)
      .single();

    if (groupError || !group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Check if user is already a member
    const { data: existingMember } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', group_id)
      .eq('member_id', user.id)
      .single();

    if (existingMember) {
      return res.status(400).json({ error: 'Already a member of this group' });
    }

    // Add user to group
    const { data: member, error: memberError } = await supabase
      .from('group_members')
      .insert({
        group_id,
        member_id: user.id,
        joined_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (memberError) {
      return res.status(400).json({ error: memberError.message });
    }

    return res.status(201).json({ 
      message: 'Successfully joined group',
      group: { id: group.id, group_name: group.group_name },
      member 
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
});

// Get group members
router.get('/:groupId/members', async (req, res) => {
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

    const { groupId } = req.params;

    // Check if user is a member of the group
    const { data: membership } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', groupId)
      .eq('member_id', user.id)
      .single();

    if (!membership) {
      return res.status(403).json({ error: 'Not a member of this group' });
    }

    // Get all members
    const { data, error } = await supabase
      .from('group_members')
      .select(`
        *,
        profiles (
          id,
          full_name,
          email,
          avatar_url
        )
      `)
      .eq('group_id', groupId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({ members: data });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
});

export default router;
