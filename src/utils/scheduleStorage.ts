interface Event {
  time: string;
  title: string;
  subtitle: string;
}

interface ScheduleState {
  events: Record<number, Event[]>;
  lastUpdated: string;
}

const STORAGE_KEY = 'user_schedule';

export const saveScheduleToStorage = (events: Record<number, Event[]>) => {
  try {
    const scheduleState: ScheduleState = {
      events,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scheduleState));
  } catch (error) {
    console.error('Failed to save schedule to storage:', error);
  }
};

export const loadScheduleFromStorage = (): Record<number, Event[]> => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const scheduleState: ScheduleState = JSON.parse(saved);
      return scheduleState.events;
    }
  } catch (error) {
    console.error('Failed to load schedule from storage:', error);
  }
  return {};
};

export const clearScheduleStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear schedule storage:', error);
  }
};

export const saveScheduleToDatabase = async (userId: string, events: Record<number, Event[]>) => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    const scheduleJson = {
      events,
      lastUpdated: new Date().toISOString(),
    } as any;

    const { error } = await supabase
      .from('schedules')
      .upsert({
        user_id: userId,
        schedule_json: scheduleJson,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Failed to save schedule to database:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to save schedule to database:', error);
    throw error;
  }
};

export const loadScheduleFromDatabase = async (userId: string): Promise<Record<number, Event[]>> => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data, error } = await supabase
      .from('schedules')
      .select('schedule_json')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Failed to load schedule from database:', error);
      return {};
    }

    if (data?.schedule_json && typeof data.schedule_json === 'object') {
      const scheduleData = data.schedule_json as { events?: Record<number, Event[]> };
      if (scheduleData.events) {
        return scheduleData.events;
      }
    }
  } catch (error) {
    console.error('Failed to load schedule from database:', error);
  }
  return {};
};