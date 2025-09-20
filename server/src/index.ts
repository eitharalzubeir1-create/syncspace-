import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pino from 'pino';
import { supabase, getServiceRoleClient } from './supabaseClient';
import groupsRouter from './routes/groups';
import schedulesRouter from './routes/schedules';
import usersRouter from './routes/users';

dotenv.config();

const logger = pino({ transport: { target: 'pino-pretty' } });
const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/groups', groupsRouter);
app.use('/api/schedules', schedulesRouter);
app.use('/api/users', usersRouter);

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'syncspace-server' });
});

// Example route: get current user's profile using anon key and auth header
app.get('/api/profiles/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length)
      : undefined;

    if (!accessToken) {
      return res.status(401).json({ error: 'Missing Bearer token' });
    }

    const client = supabase;
    // Retrieve the user from the provided access token without mutating client state
    const { data: { user }, error: userError } = await client.auth.getUser(accessToken);
    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid user session' });
    }

    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.json({ profile: data });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
});

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.get('/', (_req, res) => {
  res.send('SyncSpace API is running');
});

app.listen(port, () => {
  logger.info(`API listening on http://localhost:${port}`);
});


