import { useEffect, useState } from 'react';
import Globe from 'react-globe.gl';

const markerSvg = `<svg viewBox="-4 0 36 36">
  <path fill="currentColor" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
  <circle fill="black" cx="14" cy="14" r="7"></circle>
</svg>`;

type MarkerData = {
  lat: number;
  lng: number;
  size: number;
  color: string;
};

const GlobeComponent = () => {
  const [gData, setGData] = useState<MarkerData[]>([]);

  useEffect(() => {
    const N = 5;
    const data: MarkerData[] = [...Array(N).keys()].map(() => ({
      lat: (Math.random() - 0.5) * 180, // Random latitude between -90 and 90
      lng: (Math.random() - 0.5) * 360, // Random longitude between -180 and 180
      size: 7 + Math.random() * 30, // Random size between 7 and 37
      color: ['red', 'white', 'blue', 'green'][Math.floor(Math.random() * 4)], // Random color
    }));

    setGData(data);
  }, []);

  return (
    <Globe
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
      htmlElementsData={gData}
      htmlElement={(d: object) => {
        const marker = d as MarkerData;

        const el = document.createElement('div');
        el.innerHTML = markerSvg;
        el.style.color = marker.color;
        el.style.width = `${marker.size}px`;

        el.style.transform = 'translateY(-50px)';
        el.style.pointerEvents = 'auto';
        el.style.cursor = 'pointer';

        el.onclick = () => console.info(marker);

        return el;
      }}
    />
  );
};

export default GlobeComponent;
