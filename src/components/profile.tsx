import { useEffect, useState } from 'react';

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

function isValidPurchaseArray(data: unknown): data is Purchase[] {
  return (
    Array.isArray(data) &&
    data.every((purchase: unknown): purchase is Purchase =>
      typeof purchase === 'object' &&
      purchase !== null &&
      'id' in purchase &&
      typeof (purchase as { id: unknown }).id === 'number' &&
      'date' in purchase &&
      typeof (purchase as { date: unknown }).date === 'string' &&
      'items' in purchase &&
      Array.isArray((purchase as { items: unknown }).items) &&
      (purchase as { items: unknown[] }).items.every((item: unknown): item is Product =>
        typeof item === 'object' &&
        item !== null &&
        'id' in item &&
        typeof (item as { id: unknown }).id === 'number' &&
        'type' in item &&
        typeof (item as { type: unknown }).type === 'string' &&
        'price' in item &&
        typeof (item as { price: unknown }).price === 'string' &&
        (!('quantity' in item) || typeof (item as { quantity?: unknown }).quantity === 'number') &&
        (!('image' in item) || typeof (item as { image?: unknown }).image === 'string') &&
        (!('description' in item) || typeof (item as { description?: unknown }).description === 'string')
      )
    )
  );
}

export function Profile() {
  const [purchaseHistory, setPurchaseHistory] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let parsedHistory: unknown = [];
    try {
      const history = localStorage.getItem('purchaseHistory');
      if (history) {
        parsedHistory = JSON.parse(history);
      }
    } catch {
      parsedHistory = [];
    }
    if (isValidPurchaseArray(parsedHistory)) {
      setPurchaseHistory(parsedHistory);
    } else {
      setPurchaseHistory([]);
    }
    setLoading(false);
  }, []);

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold text-humores-bg2 mb-6 text-center">Histórico de Compras</h1>
      <button
        className="mb-6 bg-humores-bg4 text-humores-bg8 px-4 py-2 rounded hover:bg-humores-bg2 hover:text-humores-bg4 transition-colors cursor-pointer"
        onClick={() => {
          localStorage.removeItem('purchaseHistory');
          setPurchaseHistory([]);
        }}
      >
        Limpar Histórico de Compras
      </button>
      {loading ? (
        <p className="text-gray-700 text-center">Carregando...</p>
      ) : purchaseHistory.length > 0 ? (
        [...purchaseHistory].reverse().map((purchase) => (
          <div key={purchase.id} className="mb-6 border-b pb-4">
            <h2 className="text-lg font-bold text-humores-bg2 mb-2">Compra #{purchase.id}</h2>
            <p className="text-humores-bg2 mb-2">Data: {purchase.date}</p>
            {purchase.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.type}
                      className="w-12 h-12 object-contain bg-white rounded"
                    />
                  )}
                  <div>
                    <span>{item.type} (x{item.quantity || 1})</span>
                    {item.description && (
                      <div className="text-xs text-gray-600">{item.description}</div>
                    )}
                  </div>
                </div>
                <span>R$ {(parseFloat(item.price.replace('R$', '').replace(',', '.')) * (item.quantity || 1)).toFixed(2).replace('.', ',')}</span>
              </div>
            ))}
          </div>
        ))
      ) : (
        <p className="text-gray-700 text-center">Você ainda não realizou nenhuma compra.</p>
      )}
    </div>
  );
}
