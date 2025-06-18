import { RouterProvider } from 'react-router';
import { router } from './router';
import { ConversationContextProvider } from './hooks/ConversationsContext';

function App() {
  return (
    <ConversationContextProvider>
      <RouterProvider router={router} />
    </ConversationContextProvider>
  );
}

export default App;
