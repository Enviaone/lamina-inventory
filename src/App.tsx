import { AppProvider } from '@/providers/app-provider';
import { AppRouter } from '@/routes';

function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}

export default App;
