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

interface ConversationContextType {
  newMessage: string | null;
  conversations: Conversation[];
  addConversation: (query: string) => void;
  addMessage: (title: string, message: Message) => void;
}

const ConversationContext = createContext<ConversationContextType>({
  newMessage: null,
  conversations: [],
  addConversation: () => {},
  addMessage: () => {},
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
      setConversations((prev) => {
        const newConversation: Conversation = {
          title: query,
          messages: [{ role: 'user', content: query }],
        };
        return [...prev, newConversation];
      });
      setNewMessage(query);
      return query;
    },
    [setConversations]
  );

  const addMessage = useCallback(
    (title: string, message: Message) => {
      setConversations((prev) => {
        return prev.map((conversation) => {
          if (conversation.title === title) {
            return {
              ...conversation,
              messages: [...conversation.messages, message],
            };
          }
          return conversation;
        });
      });
      setNewMessage(null);
    },
    [setConversations]
  );

  return (
    <ConversationContext.Provider
      value={{ newMessage, conversations, addConversation, addMessage }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversationsContext = () => useContext(ConversationContext);
