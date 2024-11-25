import Carousel from 'react-bootstrap/Carousel';
import "bootstrap/dist/css/bootstrap.min.css";
import "./Caurousels.css";

const Caurousels = () => {
  return (
    <Carousel>
      <Carousel.Item>
        <img
          className='d-block w-100 img-fluid'
          style={{ maxHeight: '100vh',  objectFit: 'cover', objectPosition: 'center' }}
          src='https://www.superkicks.in/cdn/shop/files/GEL_KAYANO_14.png?v=1728461017'
          alt="Latest Nike Dunks"
        />
        <Carousel.Caption>
        </Carousel.Caption>
      </Carousel.Item>
      
      <Carousel.Item>
        <img
          className='d-block w-100 img-fluid'
          style={{ maxHeight: '100vh',objectFit: 'cover', objectPosition: 'center' }}
          src='https://www.superkicks.in/cdn/shop/files/PUMA_PALERMO_SUPERTIFO.jpg?v=1728131939'
          alt="Second slide"
        />
        <Carousel.Caption>
          
        </Carousel.Caption>
      </Carousel.Item>
      
      <Carousel.Item>
        <img
          className='d-block w-100 img-fluid'
          style={{ maxHeight: '100vh',objectFit: 'cover', objectPosition: 'center' }}
          src='https://www.superkicks.in/cdn/shop/files/GAZELLE_INDOOR_BANNERpsb.jpg?v=1727946424'
          alt="Third slide"
        />
        <Carousel.Caption>
          
        </Carousel.Caption>
      </Carousel.Item>
      
      <Carousel.Item>
        <img
          className='d-block w-100 img-fluid'
          style={{ maxHeight: '100vh',objectFit: 'cover', objectPosition: 'center' }}
          src='https://www.superkicks.in/cdn/shop/files/PUMA_x_KIDSUPER.png?v=1728461017'
          alt="Fourth slide"
        />
        <Carousel.Caption>
          
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default Caurousels;
