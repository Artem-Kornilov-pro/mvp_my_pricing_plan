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
    Площадь?: string;
    Система?: string;
    Паркинг?: string;
    ИТП?: 'Есть' | 'Нет';
  };
  tariff: number;
}

// Мок базы данных
const MOCK_DB: Record<string, HouseData> = {
  'г. НижнийНовгород, ул. Крупской, д. 14': {
    address: 'г. Н.Новгород, ул. Крупской, д. 14',
    details: {
      Этажность: 16,
      Подъезды: 1,
      Мусоропровод: 'Есть',
      Лифты: '2 лифта (пассажирский и грузовой)',
      Газоснабжение: 'Отсутствует',
      Консьерж: 'Есть',
      Площадь: '7650м²',
      Система: 'Пожаротушение и дымоудаление',
      Паркинг: 'Подземный',
      ИТП: 'Есть',
    },
    tariff: 45.32,
  },

  'г. Нижний Новгород, ул. Бекетова, д. 10': {
    address: 'г. Нижний Новгород, ул. Бекетова, д. 10',
    details: {
      Этажность: 25,
      Подъезды: 4,
      Мусоропровод: 'Есть',
      Лифты: 'Пассажирский, Грузовой',
      Газоснабжение: 'Отсутствует',
      Консьерж: 'Есть',
      Площадь: '12400м²',
      Система: 'Пожаротушение',
      Паркинг: 'Наземный',
      ИТП: 'Есть',
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
      Площадь: '4800м²',
      Система: 'Дымоудаление',
      Паркинг: 'Отсутствует',
      ИТП: 'Нет',
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
      Площадь: '9800м²',
      Система: 'Пожаротушение и дымоудаление',
      Паркинг: 'Подземный',
      ИТП: 'Есть',
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
      Площадь: '3200м²',
      Система: 'Нет',
      Паркинг: 'Отсутствует',
      ИТП: 'Нет',
    },
    tariff: 25.0,
  },
};



function App() {
  const [addressInput, setAddressInput] = useState('');
  const [foundHouse, setFoundHouse] = useState<HouseData | null>(null);
  const [isSuggestionsVisible, setSuggestionsVisible] = useState(false);

  // Получаем список подсказок на основе ввода
  const suggestions = useMemo(() => {
    const inputLower = addressInput.toLowerCase();
    // Если поле пустое, показываем все адреса. В противном случае - фильтруем.
    if (inputLower === '') {
      return Object.keys(MOCK_DB);
    }
    return Object.keys(MOCK_DB).filter(
      (address) =>
        address.toLowerCase().includes(inputLower)
    );
  }, [addressInput]);

  const handleSuggestionClick = (address: string) => {
    setAddressInput(address);
    setSuggestionsVisible(false);
  };

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
          placeholder="Выберите или введите адрес"
          value={addressInput}
          onChange={(e) => setAddressInput(e.target.value)}
          onFocus={() => setSuggestionsVisible(true)}
          onBlur={() => setTimeout(() => setSuggestionsVisible(false), 200)} // Небольшая задержка, чтобы успел сработать клик по подсказке
          autoComplete="off"
        />
        {isSuggestionsVisible && suggestions.length > 0 && (
          <div className="address-suggestions-list">
            {suggestions.map((address) => (
              <div
                key={address}
                className="address-suggestion"
                // Используем onMouseDown, т.к. он срабатывает до onBlur на поле ввода
                onMouseDown={() => handleSuggestionClick(address)}
              >
                {address}
              </div>
            ))}
          </div>
        )}
        <br />
        <br />
        {/* Кнопка активна, только если введенный адрес есть в нашей "базе" */}
        <button type="submit" className="button" disabled={!MOCK_DB[addressInput]}>
          Узнать тариф
        </button>
      </form>
    </div>
  );
}

export default App;
