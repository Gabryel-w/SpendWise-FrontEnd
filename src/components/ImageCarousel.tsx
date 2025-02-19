// components/ImageCarousel.js
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ImageCarousel = () => {

  const settings = {
    dots: true, // Mostra os pontos de navegação
    infinite: true, // Loop infinito
    speed: 500, // Velocidade da transição
    slidesToShow: 1, // Quantidade de slides visíveis
    slidesToScroll: 1, // Quantidade de slides a serem rolados
    autoplay: true, // Autoplay ativado
    autoplaySpeed: 3000, // Intervalo de 3 segundos
    arrows: false, // Remove as setas de navegação
  };

  const images = [
    "/imagemCarrosel.png",
    "/imagemCarrosel.png",
    "/imagemCarrosel.png",
  ];

  return (
    <div className="h-screen w-full">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="h-screen w-full">
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="h-screen w-full object-cover"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageCarousel;