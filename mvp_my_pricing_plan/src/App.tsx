import { useState, useMemo } from 'react';

// Типизация данных для дома
interface HouseData {
  address: string;
  details: {
    Этажность: number;
    Подъезды: number;
    Мусоропровод: 'Есть' | 'Нет';
    Лифты: string;
    Газоснабжение: 'Есть' | 'Отсутствует';
    Консьерж: 'Есть' | 'Нет';
  };
  tariff: number;
}

// Наша "база данных" для MVP с одним адресом
const MOCK_DB: Record<string, HouseData> = {
  'г. Нижний Новгород, ул. Бекетова, д. 10': {
    address: 'г. Нижний Новгород, ул. Бекетова, д. 10', // <-- Ваш "рабочий" адрес
    details: {
      Этажность: 25,
      Подъезды: 4,
      Мусоропровод: 'Есть',
      Лифты: 'Пассажирский, Грузовой',
      Газоснабжение: 'Отсутствует',
      Консьерж: 'Есть',
    },
    tariff: 35.42,
  },
  'г. Нижний Новгород, ул. Бекетова, д. 15А': {
    address: 'г. Нижний Новгород, ул. Бекетова, д. 15А',
    details: {
      Этажность: 9,
      Подъезды: 2,
      Мусоропровод: 'Нет',
      Лифты: 'Пассажирский',
      Газоснабжение: 'Есть',
      Консьерж: 'Нет',
    },
    tariff: 28.15,
  },
  'г. Нижний Новгород, пр-кт Гагарина, д. 55': {
    address: 'г. Нижний Новгород, пр-кт Гагарина, д. 55',
    details: {
      Этажность: 17,
      Подъезды: 3,
      Мусоропровод: 'Есть',
      Лифты: 'Пассажирский, Грузовой',
      Газоснабжение: 'Отсутствует',
      Консьерж: 'Нет',
    },
    tariff: 31.5,
  },
  'г. Нижний Новгород, ул. Минина, д. 20': {
    address: 'г. Нижний Новгород, ул. Минина, д. 20',
    details: {
      Этажность: 5,
      Подъезды: 6,
      Мусоропровод: 'Нет',
      Лифты: 'Нет',
      Газоснабжение: 'Есть',
      Консьерж: 'Нет',
    },
    tariff: 25.0,
  },
};

function App() {
  const [addressInput, setAddressInput] = useState('');
  const [foundHouse, setFoundHouse] = useState<HouseData | null>(null);

  // Получаем список подсказок на основе ввода
  const suggestions = useMemo(() => {
    if (addressInput.length < 3) {
      return [];
    }
    const inputLower = addressInput.toLowerCase();
    return Object.keys(MOCK_DB).filter(
      (address) =>
        address.toLowerCase().includes(inputLower) &&
        address.toLowerCase() !== inputLower
    );
  }, [addressInput]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const houseData = MOCK_DB[addressInput];
    if (houseData) {
      setFoundHouse(houseData);
    }
  };

  const handleReset = () => {
    setFoundHouse(null);
    setAddressInput('');
  };

  // Экран с результатами
  if (foundHouse) {
    return (
      <div className="app-container results-page">
        <h2>Информация о вашем доме</h2>
        <p className="address-header">{foundHouse.address}</p>
        <ul>
          {Object.entries(foundHouse.details).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {value}
            </li>
          ))}
        </ul>
        <div className="tariff-result">
          Рекомендованный тариф: {foundHouse.tariff} ₽ за м²
        </div>
        <button className="button" onClick={handleReset}>
          Проверить другой адрес
        </button>
      </div>
    );
  }

  return (
    // Главный экран для поиска
    <div className="app-container search-page">
      <h1>Мой Тариф</h1>
      <p>
        Многие управляющие компании завышают платежи. Введите свой адрес и
        проверьте, соответствует ли ваш тариф рекомендованным государством
        нормам.
      </p>
      <form className="address-form" onSubmit={handleSearch}>
        <input
          type="text"
          className="address-input"
          placeholder="Начните вводить адрес..."
          value={addressInput}
          onChange={(e) => setAddressInput(e.target.value)}
          autoComplete="off"
        />
        {suggestions.length > 0 && (
          <div className="address-suggestions-list">
            {suggestions.map((address) => (
              <div
                key={address}
                className="address-suggestion"
                onClick={() => setAddressInput(address)}
              >
                {address}
              </div>
            ))}
          </div>
        )}
        {/* Кнопка активна, только если введенный адрес есть в нашей "базе" */}
        <button type="submit" className="button" disabled={!MOCK_DB[addressInput]}>
          Узнать тариф
        </button>
      </form>
    </div>
  );
}

export default App;
