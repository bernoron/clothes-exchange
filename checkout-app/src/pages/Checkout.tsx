import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchSellers, fetchSellerItems, addToCart, processCheckout, Seller, Item } from '../utils/api';

interface CartItem {
  sellerId: string;
  itemId: string;
  itemNumber: number;
  title: string;
  price: number;
  sellerName: string;
}

const Checkout: React.FC = () => {
  const { t } = useTranslation();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [soldItems, setSoldItems] = useState<CartItem[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [selectedSeller, setSelectedSeller] = useState<string>('');
  const [availableItems, setAvailableItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [receiptUrl, setReceiptUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadSellers = async () => {
      try {
        const sellersData = await fetchSellers();
        setSellers(sellersData);
      } catch (err) {
        setError(t('checkout.error.fetchSellersFailed'));
      }
    };
    loadSellers();
  }, [t]);

  useEffect(() => {
    const loadItems = async () => {
      if (selectedSeller) {
        try {
          const items = await fetchSellerItems(selectedSeller);
          setAvailableItems(items.filter(item => item.status === 'available'));
        } catch (err) {
          setError(t('checkout.error.fetchItemsFailed'));
        }
      } else {
        setAvailableItems([]);
      }
      setSelectedItem('');
    };
    loadItems();
  }, [selectedSeller, t]);

  const handleAddToCart = async () => {
    if (!selectedSeller || !selectedItem) {
      setError(t('checkout.error.missingFields'));
      return;
    }

    const item = availableItems.find(i => i.id === selectedItem);
    const seller = sellers.find(s => s.id === selectedSeller);

    if (!item || !seller) {
      setError(t('checkout.error.itemNotFound'));
      return;
    }

    if (cart.some(cartItem => cartItem.itemId === item.id)) {
      setError(t('checkout.error.itemAlreadyAdded'));
      return;
    }

    try {
      setIsLoading(true);
      await addToCart(selectedSeller, selectedItem);
      setCart([...cart, {
        sellerId: selectedSeller,
        itemId: selectedItem,
        itemNumber: item.itemNumber,
        title: item.title,
        price: item.price,
        sellerName: seller.name
      }]);
      setSelectedItem('');
      setError('');
    } catch (err) {
      setError(t('checkout.error.itemNotAvailable'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.itemId !== itemId));
  };

  const handleCheckout = async () => {
    try {
      setError('');
      setSuccess('');
      setReceiptUrl('');

      if (cart.length === 0) {
        setError(t('checkout.error.emptyCart'));
        return;
      }

      const response = await processCheckout(cart);
      setSuccess(response.message);
      setReceiptUrl(response.receiptUrl);
      setSoldItems([...cart]);
      setCart([]);
      setSelectedSeller('');
      setSelectedItem('');
      setAvailableItems([]);
    } catch (error) {
      setError(t('checkout.error.checkoutFailed'));
    }
  };

  const handleDownloadReceipt = () => {
    if (receiptUrl) {
      window.open(receiptUrl, '_blank');
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Kasse</h1>

      <div className="mb-8 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verkäufer
            </label>
            <select
              value={selectedSeller}
              onChange={(e) => setSelectedSeller(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Verkäufer auswählen</option>
              {sellers.map(seller => (
                <option key={seller.id} value={seller.id}>
                  {seller.name} ({seller.sellerNumber})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Artikel
            </label>
            <select
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              disabled={!selectedSeller}
            >
              <option value="">Artikel auswählen</option>
              {availableItems.map(item => (
                <option key={item.id} value={item.id}>
                  {item.itemNumber} - {item.title} ({item.price.toFixed(2)}€)
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isLoading || !selectedSeller || !selectedItem}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Zum Warenkorb hinzufügen
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {cart.length > 0 && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Warenkorb</h2>
          <div className="space-y-4">
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-md">
                <div>
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-600">Artikelnummer: {item.itemNumber}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="font-medium text-gray-900">{item.price.toFixed(2)}€</p>
                  <button
                    onClick={() => handleRemoveFromCart(item.itemId)}
                    className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Entfernen
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
              <div className="text-lg font-bold text-gray-900">
                Gesamt: {total.toFixed(2)}€
              </div>
              <button
                onClick={handleCheckout}
                className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Kauf abschließen
              </button>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-green-800 mb-2">{success}</h2>
            <p className="text-gray-600">{new Date().toLocaleDateString('de-DE')}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Kaufbeleg</h3>
            <div className="space-y-3">
              {soldItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-600">
                      Artikelnummer: {item.itemNumber} | Verkäufer: {item.sellerName}
                    </p>
                  </div>
                  <p className="font-medium text-gray-900">{item.price.toFixed(2)}€</p>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2 font-bold text-gray-900">
                <p>Gesamt</p>
                <p>{soldItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}€</p>
              </div>
            </div>
          </div>

          {receiptUrl && (
            <div className="text-center">
              <button
                onClick={handleDownloadReceipt}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Beleg herunterladen
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Checkout; 