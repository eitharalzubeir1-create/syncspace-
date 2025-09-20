
interface GroupsState {
  currentScreen: 'overview' | 'create' | 'schedule';
  selectedGroup: any | null;
  pendingGroup: any | null;
  formData?: {
    groupName: string;
    selectedFriends: string[];
  };
}

const STORAGE_KEY = 'groups_progress';

export const saveGroupsState = (state: Partial<GroupsState>) => {
  try {
    const existingState = loadGroupsState();
    const newState = { ...existingState, ...state };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  } catch (error) {
    console.error('Failed to save groups state:', error);
  }
};

export const loadGroupsState = (): GroupsState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load groups state:', error);
  }
  return {
    currentScreen: 'overview',
    selectedGroup: null,
    pendingGroup: null,
  };
};

export const clearGroupsState = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear groups state:', error);
  }
};
