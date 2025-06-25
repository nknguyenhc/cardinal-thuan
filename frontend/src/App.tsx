import { RouterProvider } from 'react-router';
import { router } from './router';
import { ConversationContextProvider } from './hooks/ConversationsContext';
import { SnackbarContextProvider } from './hooks/SnackbarContext';

function App() {
  return (
    <ConversationContextProvider>
      <SnackbarContextProvider>
        <RouterProvider router={router} />
      </SnackbarContextProvider>
    </ConversationContextProvider>
  );
}

export default App;
