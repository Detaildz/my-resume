import { CSSProperties } from 'react';
import GlobeComponent from '../components/Globe';
import colors from '../styles/colors';

const Home = () => {
  return (
    <>
      <div style={styles.main}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',

            zIndex: 1,
          }}
        >
          <GlobeComponent />;
        </div>
        <div style={{ ...styles.mainText }}>
          <h1 style={{ fontSize: '8rem' }}>WELCOME</h1>
          <h3 style={{ fontSize: '1.5rem' }}> to the world of</h3>
          <h2 style={{ fontSize: '3rem' }}> Darjuš Žukovski</h2>
        </div>
      </div>
    </>
  );
};

const styles: { [key: string]: CSSProperties } = {
  main: {
    width: '100%',
  },
  mainText: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.white,
    textShadow: '5px 5px 28px rgba(234, 228, 245, 1)',
    fontWeight: 'bold',
    zIndex: 2,
    left: '49%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    userSelect: 'none',
    transition: 'all 3s ease-in-out',
  },
};

export default Home;
