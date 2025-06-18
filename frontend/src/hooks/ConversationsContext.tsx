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
} from './localConversations';

interface ConversationContextType {
  conversations: Conversation[];
  setConversations: (
    conversations: Conversation[] | ((prev: Conversation[]) => Conversation[])
  ) => void;
}

const ConversationContext = createContext<ConversationContextType>({
  conversations: [],
  setConversations: () => {},
});

export const ConversationContextProvider = ({
  children,
}: PropsWithChildren) => {
  const [conversations, _setConversations] = useState<Conversation[]>(
    loadLocalConversations()
  );

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

  return (
    <ConversationContext.Provider value={{ conversations, setConversations }}>
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversationsContext = () => useContext(ConversationContext);
