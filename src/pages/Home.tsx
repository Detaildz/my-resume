import ThreeSphere from '../components/Globe.tsx';

const Home = () => {
  return (
    <>
      {/* <div style={styles.container}>
        <h1 style={styles.welcomeText}>Welcome</h1>
        <h1 style={styles.secondText}> to the world of</h1>
        <h2 style={styles.myNameText}>Darjuš Žukovski</h2>
      </div> */}
      <ThreeSphere />
    </>
  );
};

// const styles: {
//   container: React.CSSProperties;
//   welcomeText: React.CSSProperties;
//   secondText: React.CSSProperties;
//   myNameText: React.CSSProperties;
// } = {
//   container: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//   },
//   welcomeText: {
//     fontSize: '6rem',
//     textAlign: 'center',
//   },
//   secondText: {
//     fontSize: '1.5rem',
//     textAlign: 'center',
//   },
//   myNameText: {
//     fontSize: '3rem',
//     textAlign: 'center',
//   },
// };

export default Home;
