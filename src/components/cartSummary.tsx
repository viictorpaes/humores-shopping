import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  type: string;
  price: string;
  quantity?: number;
  image?: string;
  description?: string;
}

interface Purchase {
  id: number;
  date: string;
  items: Product[];
}

interface CartSummaryProps {
  cartItems: Product[];
  removeFromCart: (id: number) => void;
  setCartItems: (items: Product[]) => void;
}

export function CartSummary({ cartItems, removeFromCart, setCartItems }: CartSummaryProps) {
  const navigate = useNavigate();
  const [installments, setInstallments] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [redirectTimeout, setRedirectTimeout] = useState<NodeJS.Timeout | null>(null);

  const total = cartItems.reduce(
    (sum, item) =>
      sum +
      parseFloat(
        item.price
          .replace('R$', '')
          .replace(/\./g, '')
          .replace(',', '.')
      ) * (item.quantity || 1),
    0
  );

  const installmentValue = (total / installments).toFixed(2).replace('.', ',');

  const handleConfirmPurchase = () => {
    if (cartItems.length > 0) {
      // Garante que o histórico seja sempre um array de objetos Purchase
      let purchaseHistory: Purchase[] = [];
      try {
        const raw = localStorage.getItem('purchaseHistory');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            purchaseHistory = parsed.filter(
              (p) =>
                p &&
                typeof p.id === 'number' &&
                typeof p.date === 'string' &&
                Array.isArray(p.items)
            );
          }
        }
      } catch {
        purchaseHistory = [];
      }
      const newPurchase: Purchase = {
        id: purchaseHistory.length + 1,
        date: new Date().toLocaleString(),
        items: [...cartItems],
      };
      localStorage.setItem('purchaseHistory', JSON.stringify([...purchaseHistory, newPurchase]));
      setCartItems([]); // Limpa o carrinho após salvar
      setShowModal(true); // Exibe o modal de finalização
      // Redireciona automaticamente após 2 segundos
      const timeout = setTimeout(() => {
        setShowModal(false);
        navigate('/profile');
      }, 2000);
      setRedirectTimeout(timeout);
    } else {
      alert('Seu carrinho está vazio.');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (redirectTimeout) {
      clearTimeout(redirectTimeout);
    }
    navigate('/profile');
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold text-humores-bg2 mb-6 text-center">Resumo do Carrinho</h1>
      <div className="mb-6">
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between items-center mb-4 border-b pb-2">
            <div className="flex items-center gap-4">
              <img
                src={item.image}
                alt={item.type}
                className="w-16 h-16 object-contain bg-white rounded"
              />
              <div>
                <span className="block font-bold">{item.type}</span>
                {item.description && (
                  <span className="block text-sm text-gray-600">{item.description}</span>
                )}
                <span className="block">Qtd: {item.quantity || 1}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span>R$ {(parseFloat(
                item.price
                  .replace('R$', '')
                  .replace(/\./g, '')
                  .replace(',', '.')
              ) * (item.quantity || 1)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <button
                className="bg-[#DCAB6B] text-humores-bg4 px-4 py-2 rounded hover:bg-humores-bg2 hover:text-humores-bg4 transition-colors cursor-pointer"
                onClick={() => removeFromCart(item.id)}
              >
                Remover
              </button>
            </div>
          </div>
        ))}
        <div className="text-lg font-bold text-humores-bg2 mt-4">
          Total: R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-humores-bg2 mb-4">Opções de Pagamento</h2>
        <select
          className="w-full p-2 border rounded mb-4"
          value={installments}
          onChange={(e) => setInstallments(Number(e.target.value))}
        >
          <option value={1}>1x sem juros</option>
          <option value={2}>2x sem juros</option>
          <option value={3}>3x sem juros</option>
          <option value={4}>4x sem juros</option>
        </select>
        <p className="text-humores-bg2">
          Valor da parcela: <span className="font-bold">R$ {installmentValue}</span>
        </p>
      </div>
      <div className="flex justify-between">
        <button
          className="bg-[#DCAB6B] text-humores-bg4 px-4 py-2 rounded hover:bg-humores-bg2 hover:text-humores-bg4 transition-colors cursor-pointer"
          onClick={() => navigate('/')}
        >
          Continuar Comprando
        </button>
        <button
          className="bg-[#DCAB6B] text-humores-bg4 px-4 py-2 rounded hover:bg-humores-bg2 hover:text-humores-bg4 transition-colors cursor-pointer"
          onClick={handleConfirmPurchase}
        >
          Confirmar Compra
        </button>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-20">
          <div className="bg-white p-8 rounded shadow text-center">
            <h2 className="text-2xl font-bold text-humores-bg2 mb-4">Compra finalizada!</h2>
            <p className="text-humores-bg6">Obrigado por comprar conosco.</p>
            <button
              className="bg-[#DCAB6B] text-humores-bg4 px-4 py-2 rounded hover:bg-humores-bg2 hover:text-humores-bg4 transition-colors cursor-pointer mt-4"
              onClick={handleCloseModal}
            >
              Ir para o Histórico
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
