import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  camisetas, calcas, jaquetas, tenis,
  oculos, jeans, bones, acessorios
} from '../data/products';

const productTypes = [
  { key: 'camisetas', title: 'Camisetas', data: camisetas },
  { key: 'calcas', title: 'Calças', data: calcas },
  { key: 'jaquetas', title: 'Jaquetas', data: jaquetas },
  { key: 'tenis', title: 'Tênis', data: tenis },
  { key: 'oculos', title: 'Óculos', data: oculos },
  { key: 'jeans', title: 'Jeans', data: jeans },
  { key: 'bones', title: 'Bonés', data: bones },
  { key: 'acessorios', title: 'Acessórios', data: acessorios },
];

export function Body() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(
    Object.fromEntries(productTypes.map(({ key }) => [key, 0]))
  );

  const renderProductCard = (key: string, title: string, data: typeof camisetas) => {
    const idx = currentIndex[key];
    const currentProduct = data[idx];

    return (
      <div
        key={key}
        className="border border-humores-bg2 p-6 rounded-lg shadow-md bg-humores-bg4 flex flex-col items-center h-auto"
      >
        <h2
          className="text-2xl font-bold text-humores-bg2 mb-4 cursor-pointer hover:underline font-exo"
          onClick={() => navigate(`/product/${key}`)}
        >
          {title}
        </h2>
        <div
          className="relative w-64 h-64 mb-4 flex items-center justify-center cursor-pointer"
          onClick={() => navigate(`/product/${key}/${currentProduct.id}`)}
        >
          <img
            src={currentProduct.image}
            alt={currentProduct.type}
            className="w-full h-full rounded-md object-contain bg-white transition-transform duration-300 hover:scale-110"
            loading="lazy"
          />
        </div>
        <div className="flex justify-center gap-2 mt-2">
          {data.map((_, pageIndex) => (
            <button
              key={pageIndex}
              className={`w-3 h-3 rounded-full transition-transform transform ${
                idx === pageIndex ? 'bg-[#DCAB6B]' : 'bg-[#F0D9B5]'
              } hover:scale-125`}
              onClick={() =>
                setCurrentIndex((prev) => ({
                  ...prev,
                  [key]: pageIndex,
                }))
              }
              onMouseEnter={() =>
                setCurrentIndex((prev) => ({
                  ...prev,
                  [key]: pageIndex,
                }))
              }
            ></button>
          ))}
        </div>
        <h3 className="text-lg font-bold text-black text-center mt-4">{currentProduct.type}</h3>
      </div>
    );
  };

  return (
    <main className="p-6 bg-white min-h-screen">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-humores-bg2 font-exo mb-2">
          Melhores roupas de grife para homens
        </h1>
        <span className="text-2xl font-bold text-humores-bg2 font-exo">
          Vista-se bem, Vista-se com a Humores.
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {productTypes.map(({ key, title, data }) => renderProductCard(key, title, data))}
      </div>
    </main>
  );
}
