import { isValidId } from './id';

export interface Message {
  role: 'assistant' | 'user';
  content: string;
}

export interface Conversation {
  id: string;
  title: string | null;
  messages: Message[];
}

const LOCAL_STORAGE_KEY = 'conversations';

export const loadLocalConversations = (): Conversation[] => {
  const storedConversations = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!storedConversations) {
    return [];
  }
  let conversations;
  try {
    conversations = JSON.parse(storedConversations);
  } catch (error) {
    console.warn(
      `Invalid JSON in localStorage for key "${LOCAL_STORAGE_KEY}": ${storedConversations}`
    );
    return [];
  }
  if (!Array.isArray(conversations)) {
    console.warn(
      `Conversations in localStorage is not an array, found ${conversations}.`
    );
    return [];
  }
  const ids = new Set<string>();
  const validConversations = conversations.filter((conv) => {
    if (
      !conv ||
      (typeof conv.title !== 'string' && conv.title !== null) ||
      !Array.isArray(conv.messages)
    ) {
      console.warn('Invalid conversation format:', conv);
      return false;
    }
    if (!isValidId(conv.id)) {
      console.warn(`Invalid conversation ID: ${conv.id}`);
      return false;
    }
    if (ids.has(conv.id)) {
      console.warn(`Duplicate conversation ID found: ${conv.id}`);
      return false;
    }
    ids.add(conv.id);
    const areMessagesValid = conv.messages.every(
      (msg: any) =>
        msg &&
        (msg.role === 'assistant' || msg.role === 'user') &&
        typeof msg.content === 'string'
    );
    if (!areMessagesValid) {
      console.warn('Invalid messages in conversation:', conv.messages);
      return false;
    }
    return true;
  });
  return validConversations;
};

export const saveLocalConversations = (conversations: Conversation[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(conversations));
};
