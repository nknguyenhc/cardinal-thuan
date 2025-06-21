import {
  createContext,
  useCallback,
  useContext,
  useState,
  type PropsWithChildren,
} from 'react';
import {
  loadLocalConversations,
  saveLocalConversations,
  type Conversation,
  type Message,
} from './localConversations';
import { generateRandomId } from './id';

interface ConversationContextType {
  getNewMessage: () => string | null;
  conversations: Conversation[];
  addConversation: (query: string) => void;
  addMessage: (id: string, message: Message) => void;
  setConversation: (id: string, messages: Message[]) => void;
}

const ConversationContext = createContext<ConversationContextType>({
  getNewMessage: () => null,
  conversations: [],
  addConversation: () => {},
  addMessage: () => {},
  setConversation: () => {},
});

export const ConversationContextProvider = ({
  children,
}: PropsWithChildren) => {
  const [conversations, _setConversations] = useState<Conversation[]>(
    loadLocalConversations()
  );
  const [newMessage, setNewMessage] = useState<string | null>(null);

  const setConversations = useCallback(
    (
      conversations: Conversation[] | ((prev: Conversation[]) => Conversation[])
    ) => {
      _setConversations((prev) => {
        if (typeof conversations === 'function') {
          const newConversations = conversations(prev);
          saveLocalConversations(newConversations);
          return newConversations;
        } else {
          saveLocalConversations(conversations);
          return conversations;
        }
      });
    },
    []
  );

  const addConversation = useCallback(
    (query: string) => {
      const newId = generateRandomId();
      setConversations((prev) => {
        const newConversation: Conversation = {
          id: newId,
          title: query,
          messages: [{ role: 'user', content: query }],
        };
        return [...prev, newConversation];
      });
      setNewMessage(query);
      return newId;
    },
    [setConversations]
  );

  const addMessage = useCallback(
    (id: string, message: Message) => {
      setConversations((prev) => {
        return prev.map((conversation) => {
          if (conversation.id === id) {
            return {
              ...conversation,
              messages: [...conversation.messages, message],
            };
          }
          return conversation;
        });
      });
    },
    [setConversations]
  );

  const getNewMessage = useCallback(() => {
    const message = newMessage;
    setTimeout(() => setNewMessage(null));
    return message;
  }, [newMessage]);

  const setConversation = useCallback(
    (id: string, messages: Message[]) => {
      setConversations((prev) => {
        return prev.map((conversation) => {
          if (conversation.id === id) {
            return {
              ...conversation,
              messages: [...messages],
            };
          }
          return conversation;
        });
      });
    },
    [setConversations]
  );

  return (
    <ConversationContext.Provider
      value={{
        getNewMessage,
        conversations,
        addConversation,
        addMessage,
        setConversation,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversationsContext = () => useContext(ConversationContext);
