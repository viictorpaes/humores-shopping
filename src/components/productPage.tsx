import { useParams, useNavigate } from 'react-router-dom';
import {
  camisetas, calcas, jaquetas, tenis,
  oculos, jeans, bones, acessorios
} from '../data/products';
import { useState } from 'react';
import { AiOutlineArrowLeft } from 'react-icons/ai';

const allTypes = {
  camisetas, calcas, jaquetas, tenis, oculos, jeans, bones, acessorios
};

interface Product {
  id: number | string;
  type: string;
  price: string;
  description: string;
  image: string;
}

export function ProductPage({ addToCart }: { addToCart: (product: Product) => void }) {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);

  const products = type && allTypes[type as keyof typeof allTypes] ? allTypes[type as keyof typeof allTypes] : [];
  const product = products.find((p) => String(p.id) === id);

  if (!product) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-humores-bg2 mb-4">Produto não encontrado</h2>
        <button
          className="bg-[#DCAB6B] text-humores-bg4 px-4 py-2 rounded mt-4 hover:bg-humores-bg2 hover:text-humores-bg4 transition-colors"
          onClick={() => navigate(-1)}
        >
          Voltar
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      navigate('/');
    }, 700);
  };

  return (
    <div className="p-8 flex flex-col items-center bg-white min-h-screen relative">
      <button
        className="absolute top-4 left-4 bg-transparent p-2 rounded-full hover:bg-humores-bg4 transition-colors cursor-pointer transition-transform duration-200 hover:scale-110"
        onClick={() => navigate(-1)}
        aria-label="Voltar"
        type="button"
      >
        <AiOutlineArrowLeft size={32} className="text-humores-bg2" />
      </button>
      <div className="max-w-lg w-full border border-humores-bg2 rounded-lg shadow-md bg-humores-bg4 p-8 flex flex-col items-center">
        <img
          src={product.image}
          alt={product.type}
          className="w-80 h-80 object-contain bg-white rounded mb-6 transition-transform duration-300 hover:scale-110"
        />
        <h1 className="text-2xl font-bold text-humores-bg2 mb-2">{product.type}</h1>
        <div className="text-lg text-humores-bg2 mb-2 font-bold">
          {(() => {
            const price = product.price.replace('R$', '').replace(/\./g, '').replace(',', '.');
            return 'R$ ' + Number(price).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          })()}
        </div>
        <div className="text-gray-700 mb-4 text-center">{product.description}</div>
        <button
          className={`bg-[#DCAB6B] text-humores-bg4 px-4 py-2 rounded hover:bg-humores-bg2 hover:text-humores-bg4 transition-colors cursor-pointer transition-transform duration-200 hover:scale-105 ${added ? 'ring-4 ring-humores-bg4 animate-bounce-once' : ''}`}
          onClick={handleAddToCart}
        >
          {added ? 'Adicionado!' : 'Adicionar ao Carrinho'}
        </button>
      </div>
    </div>
  );
}
