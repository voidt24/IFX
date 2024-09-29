import { useState, useContext, useRef } from 'react';

import { Context } from '../context/Context';
import SliderCard from './SliderCard';

export const Similar = ({similar}) => {

  const { currentMediaType } = useContext(Context);

  const similarContainerRef = useRef(null);
  const [similarMaximized, setSimilarMaximized] = useState(false);

  return (
    <>
      <h3>Similar</h3>
      {similar.length > 0 ? (
        <div className='similar' ref={similarContainerRef} style={{ height: '350px', position: 'relative', zIndex: '1' }}>
          {similar.map((result) => {
            return <SliderCard result={result} changeMediaType={currentMediaType == 'movies' ? 'movie' : 'tv'} key={result.id + 56356} />;
          })}
          <span
            style={{
              display: similarMaximized ? 'none' : 'block',
              zIndex: '2',
              height: '150px',
              width: '100%',
              position: 'absolute',
              bottom: '0',
              left: '0',
              background: similar.length > 10 ? 'linear-gradient(transparent, #000000de, black)' : 'none',
            }}
          >
            <p
              onClick={() => {
                (similarContainerRef.current.style.height = '100%'); setSimilarMaximized(true);
              }}
              style={{ textDecoration: 'underline', cursor: 'pointer', textAlign: 'center', position: 'absolute', bottom: '0', left: '50%', transform: 'translate(-50%)' }}
            >
              See all
            </p>
          </span>
        </div>
      ) : (
        <p style={{ textAlign: 'center' }}>No similar results available</p>
      )}
    </>
  );
};

export default Similar;
