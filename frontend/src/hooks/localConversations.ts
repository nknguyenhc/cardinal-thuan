export interface Message {
  role: 'assistant' | 'user';
  content: string;
}

export interface Conversation {
  title: string;
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
  const validConversations = conversations.filter((conv) => {
    if (!conv || !conv.title || !Array.isArray(conv.messages)) {
      console.warn('Invalid conversation format:', conv);
      return false;
    }
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
