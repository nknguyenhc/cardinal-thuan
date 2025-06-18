import { RouterProvider } from 'react-router';
import { router } from './router';
import { ConversationContextProvider } from './hooks/ConversationsContext';
import { SideMenu } from './components/SideMenu/SideMenu';

function App() {
  return (
    <ConversationContextProvider>
      <SideMenu />
      <RouterProvider router={router} />
    </ConversationContextProvider>
  );
}

export default App;
