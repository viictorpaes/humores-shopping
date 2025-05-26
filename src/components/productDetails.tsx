import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  camisetas, calcas, jaquetas, tenis,
  oculos, jeans, bones, acessorios
} from '../data/products';
import { AiOutlineArrowLeft } from 'react-icons/ai';

interface Product {
  id: number;
  type: string;
  price: string;
  image: string;
  description: string;
}

const productsByType: Record<string, Product[]> = {
  camisetas, calcas, jaquetas, tenis, oculos, jeans, bones, acessorios
};

const titles: Record<string, string> = {
  camisetas: 'Camisetas',
  calcas: 'Calças',
  jaquetas: 'Jaquetas',
  tenis: 'Tênis',
  oculos: 'Óculos',
  jeans: 'Jeans',
  bones: 'Bonés',
  acessorios: 'Acessórios',
};

export function ProductDetails({ addToCart }: { addToCart: (product: { id: number; type: string; price: string }) => void }) {
  const { type } = useParams();
  const navigate = useNavigate();
  const products = type ? productsByType[type] : undefined;
  const title = type ? titles[type] || type : '';
  const [addedMap, setAddedMap] = useState<{ [id: number]: boolean }>({});

  if (!products) {
    return <div className="p-6 text-center">Tipo de produto não encontrado.</div>;
  }

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setAddedMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product.id]: false }));
    }, 700);
  };

  return (
    <div className="p-6 bg-white min-h-screen relative">
      <button
        className="absolute top-4 left-4 bg-transparent p-2 rounded-full hover:bg-humores-bg4 transition-colors cursor-pointer transition-transform duration-200 hover:scale-110"
        onClick={() => navigate(-1)}
        aria-label="Voltar"
        type="button"
      >
        <AiOutlineArrowLeft size={32} className="text-humores-bg2" />
      </button>
      <h1 className="text-2xl font-bold text-humores-bg2 mb-6 text-center font-exo">{title}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className={`border border-humores-bg2 p-4 rounded-lg shadow-md bg-humores-bg4 flex flex-col items-center transition-transform duration-300`}
          >
            <img
              src={product.image}
              alt={product.type}
              className="w-64 h-64 rounded-md mb-4 object-contain bg-white transition-transform duration-300 hover:scale-110"
            />
            <h2 className="text-lg font-bold text-black font-exo">{product.type}</h2>
            <p className="text-humores-bg2 mt-2 font-bold">
              {(() => {
                const price = product.price.replace('R$', '').replace(/\./g, '').replace(',', '.');
                return 'R$ ' + Number(price).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
              })()}
            </p>
            <p className="text-gray-700 mt-4 text-center">{product.description}</p>
            <button
              className="mt-4 bg-[#DCAB6B] text-humores-bg4 px-4 py-2 rounded hover:bg-humores-bg2 hover:text-humores-bg4 transition-colors cursor-pointer transition-transform duration-200 hover:scale-105"
              onClick={() => handleAddToCart(product)}
            >
              {addedMap[product.id] ? 'Adicionado!' : 'Adicionar ao Carrinho'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
