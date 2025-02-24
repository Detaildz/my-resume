import ThreeSphere from '../components/Globe.tsx';

const Home = () => {
  return (
    <>
      <div style={styles.container}>
        <h1 style={styles.mainText}>Welcome to my world</h1>
      </div>
      <ThreeSphere />
    </>
  );
};

const styles: {
  container: React.CSSProperties;
  mainText: React.CSSProperties;
} = {
  container: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  mainText: {
    fontSize: '4rem',
    textAlign: 'center',
  },
};

export default Home;
