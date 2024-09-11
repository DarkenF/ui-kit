import './App.css';
import { UiContainer } from './components/UIContainer.tsx';
import { PortalsListenersProvider } from './context/portalsContext.tsx';
function App() {
  return (
    <PortalsListenersProvider>
      <>
        <div
        // style={{
        //   width: '1500px',
        //   height: '3000px',
        //   display: 'flex',
        //   justifyContent: 'center',
        //   alignItems: 'center',
        // }}
        >
          <UiContainer />
        </div>
        <div id="portal-container"></div>
      </>
    </PortalsListenersProvider>
  );
}

export default App;
