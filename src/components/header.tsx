import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import humoresLogo from '../assets/humores-logo.svg';
import { AiOutlineUser, AiOutlineHome, AiOutlineShoppingCart, AiOutlineSearch, AiOutlineClose } from 'react-icons/ai';
import { allProducts, camisetas, calcas, jaquetas, tenis, oculos, jeans, bones, acessorios } from '../data/products';

interface Product {
  id: number;
  type: string;
  price: string;
  quantity?: number;
  description?: string;
  image?: string;
}

interface HeaderProps {
  cartItems: Product[];
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  finalizePurchase: () => void;
}

export function Header({ cartItems, removeFromCart, clearCart, finalizePurchase }: HeaderProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showModal, setShowModal] = useState(false); // Estado para o modal de finalização
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const navigate = useNavigate();

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleSearch = () => {
    const searchTerm = search.trim().toLowerCase();
    if (searchTerm) {
      const results = allProducts.filter(
        p => p.type.toLowerCase().includes(searchTerm)
      );
      if (results.length > 0) {
        setSearchResults(results);
        setShowResultsModal(true);
      } else {
        setSearchResults([]);
        setShowResultsModal(true);
      }
      setShowSearch(false);
    }
    setSearch('');
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleResultClick = (product: Product) => {
    let typeKey = '';
    if (camisetas.some(p => p.id === product.id)) typeKey = 'camisetas';
    else if (calcas.some(p => p.id === product.id)) typeKey = 'calcas';
    else if (jaquetas.some(p => p.id === product.id)) typeKey = 'jaquetas';
    else if (tenis.some(p => p.id === product.id)) typeKey = 'tenis';
    else if (oculos.some(p => p.id === product.id)) typeKey = 'oculos';
    else if (jeans.some(p => p.id === product.id)) typeKey = 'jeans';
    else if (bones.some(p => p.id === product.id)) typeKey = 'bones';
    else if (acessorios.some(p => p.id === product.id)) typeKey = 'acessorios';

    if (typeKey) {
      setShowResultsModal(false);
      navigate(`/product/${typeKey}`);
    }
  };

  const handleFinalizePurchase = () => {
    const purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory') || '[]');
    const newPurchase = {
      id: purchaseHistory.length + 1,
      date: new Date().toLocaleString(),
      items: [...cartItems],
    };
    localStorage.setItem('purchaseHistory', JSON.stringify([...purchaseHistory, newPurchase]));
    finalizePurchase(); // Limpa o carrinho
    setShowModal(false); // Fecha o modal
    setIsCartOpen(false); // Fecha o carrinho
    navigate('/profile'); // Redireciona para o histórico de compras
  };

  return (
    <>
      <header className="bg-[#DCAB6B] flex items-center justify-between font-roboto px-4 border-b border-humores-bg2">
        <div className="flex items-center gap-2">
          <AiOutlineHome
            className="h-14 w-14 text-black cursor-pointer hover:text-humores-bg2"
            onClick={() => navigate('/')}
          />
          <div className="flex items-center gap-1 relative">
            <AiOutlineSearch
              className="h-14 w-14 text-black cursor-pointer hover:text-humores-bg2"
              onClick={() => setShowSearch((prev) => !prev)}
            />
            {showSearch && (
              <input
                type="text"
                placeholder="Pesquisar"
                value={search}
                autoFocus
                onChange={e => setSearch(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="px-2 py-1 rounded border border-humores-bg2 focus:outline-none focus:ring-2 focus:ring-humores-bg2 text-black w-32 absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-white"
                style={{ background: "#fff" }}
                onBlur={() => setShowSearch(false)}
              />
            )}
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <img
            src={humoresLogo}
            alt="Humores Logo"
            className="h-30 w-50 rounded-full cursor-pointer"
            onClick={() => navigate('/')}
          />
        </div>
        <div className="flex items-center gap-4">
          <AiOutlineUser
            className="h-14 w-14 text-black cursor-pointer hover:text-humores-bg2"
            onClick={() => navigate('/profile')} // Redireciona para a página de perfil
          />
          <AiOutlineShoppingCart
            className="h-14 w-14 text-black cursor-pointer hover:text-humores-bg2"
            onClick={toggleCart}
          />
        </div>
      </header>
      {/* Modal de resultados da pesquisa */}
      {showResultsModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto relative">
            {/* Botão de fechar no canto superior direito */}
            <button
              className="absolute top-2 right-2 text-humores-bg2 hover:text-humores-bg6"
              onClick={() => setShowResultsModal(false)}
              aria-label="Fechar"
            >
              <AiOutlineClose size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-humores-bg2">Resultados da Pesquisa</h2>
            {searchResults.length > 0 ? (
              <ul>
                {searchResults.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-4 mb-4 cursor-pointer hover:bg-humores-bg5 p-2 rounded transition"
                    onClick={() => handleResultClick(item)}
                  >
                    <img
                      src={item.image}
                      alt={item.type}
                      className="w-12 h-12 object-contain bg-white rounded"
                    />
                    <div>
                      <div className="font-bold text-humores-bg2">{item.type}</div>
                      <div className="text-humores-bg2">{item.price}</div>
                      {item.description && (
                        <div className="text-xs text-gray-600">{item.description}</div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-humores-bg2">Nenhum produto encontrado.</div>
            )}
          </div>
        </div>
      )}
      {isCartOpen && (
        <div
          className="fixed top-0 right-0 h-auto max-h-screen w-[500px] shadow-lg z-50 bg-white"
        >
          <div className="p-6 overflow-y-auto max-h-[80vh] relative">
            {/* Botão de fechar no canto superior direito */}
            <button
              className="absolute top-2 right-2 text-humores-bg2 hover:text-humores-bg6"
              onClick={toggleCart}
              aria-label="Fechar"
            >
              <AiOutlineClose size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-humores-bg2">Carrinho de Compras</h2>
            {cartItems.length > 0 ? (
              <>
                <ul>
                  {cartItems.map((item) => (
                    <li key={item.id} className="mb-4 flex gap-3 items-center border-b pb-2">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.type}
                          className="w-16 h-16 object-contain bg-white rounded"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">
                            {(() => {
                              let tipo = '';
                              if (camisetas.some(p => p.id === item.id)) tipo = 'Camiseta';
                              else if (calcas.some(p => p.id === item.id)) tipo = 'Calça';
                              else if (jaquetas.some(p => p.id === item.id)) tipo = 'Jaqueta';
                              else if (tenis.some(p => p.id === item.id)) tipo = 'Tênis';
                              else if (oculos.some(p => p.id === item.id)) tipo = 'Óculos';
                              else if (jeans.some(p => p.id === item.id)) tipo = 'Jeans';
                              else if (bones.some(p => p.id === item.id)) tipo = 'Boné';
                              else if (acessorios.some(p => p.id === item.id)) tipo = 'Acessório';
                              return tipo;
                            })()}
                          </span>
                          <span>-</span>
                          <span className="font-semibold">{item.type}</span>
                        </div>
                        {item.description && (
                          <div className="text-xs text-gray-600 mt-1">{item.description}</div>
                        )}
                        <div className="flex gap-4 mt-1 text-sm">
                          <span>Preço: <span className="font-bold">{item.price}</span></span>
                          <span>Qtd: <span className="font-bold">{item.quantity || 1}</span></span>
                          <span>
                            Total:{' '}
                            <span className="font-bold">
                              R$ {(parseFloat(item.price.replace('R$', '').replace(',', '.')) * (item.quantity || 1)).toFixed(2).replace('.', ',')}
                            </span>
                          </span>
                        </div>
                      </div>
                      <button
                        className="bg-[#DCAB6B] text-humores-bg4 px-4 py-2 rounded hover:bg-humores-bg2 hover:text-humores-bg4 transition-colors cursor-pointer"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remover
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 text-lg font-bold text-humores-bg2">
                  Total: R${' '}
                  {cartItems
                    .reduce(
                      (total, item) =>
                        total + parseFloat(item.price.replace('R$', '').replace(',', '.')) * (item.quantity || 1),
                      0
                    )
                    .toFixed(2)
                    .replace('.', ',')}
                </div>
                <button
                  className="bg-[#DCAB6B] text-humores-bg4 px-4 py-2 rounded hover:bg-humores-bg2 hover:text-humores-bg4 transition-colors cursor-pointer mt-4 w-full"
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/cart-summary');
                  }}
                >
                  Finalizar Compra
                </button>
                <button
                  className="bg-[#DCAB6B] text-humores-bg4 px-4 py-2 rounded hover:bg-humores-bg2 hover:text-humores-bg4 transition-colors cursor-pointer mt-4 w-full"
                  onClick={() => {
                    clearCart();
                    setIsCartOpen(false);
                  }}
                >
                  Remover Tudo
                </button>
              </>
            ) : (
              <p className="text-gray-700">Seu carrinho está vazio.</p>
            )}
          </div>
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-8 rounded shadow text-center">
            <h2 className="text-2xl font-bold text-humores-bg2 mb-4">Confirmar Compra</h2>
            <p className="text-humores-bg6 mb-4">Deseja finalizar sua compra?</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-humores-bg4 text-humores-bg8 px-4 py-2 rounded hover:bg-humores-bg2 hover:text-humores-bg4 transition-colors"
                onClick={handleFinalizePurchase}
              >
                Confirmar
              </button>
              <button
                className="bg-humores-bg4 text-humores-bg8 px-4 py-2 rounded hover:bg-humores-bg2 hover:text-humores-bg4 transition-colors"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}