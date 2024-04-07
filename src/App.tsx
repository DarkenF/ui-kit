import './App.css';
import { UiContainer } from './components/UIContainer.tsx';
import { PortalsListenersProvider } from './context/portalsContext.tsx';
function App() {
  return (
    <PortalsListenersProvider>
      <>
        <UiContainer />
        <div id="portal-container"></div>
      </>
    </PortalsListenersProvider>
  );
}

export default App;
