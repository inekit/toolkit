import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { SECTIONS, getAllCalculators, Section } from '@/config/sections';
import styles from './Search.module.scss';

interface SearchProps {
  variant?: 'header' | 'page';
  placeholder?: string;
  sectionId?: string; // ID категории для контекстного поиска
}

const Search: React.FC<SearchProps> = ({
  variant = 'header',
  placeholder = 'Поиск калькуляторов и конвертеров...',
  sectionId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<
    Array<{
      section: string;
      calculator: any;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Определяем текущую категорию из URL если sectionId не передан
  const currentSectionId = sectionId || location.pathname.split('/')[1];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);

    // Имитация задержки поиска
    setTimeout(() => {
      let searchableCalculators;

      if (currentSectionId && currentSectionId !== '') {
        // Контекстный поиск в конкретной категории
        const currentSection = SECTIONS.find((s) => s.id === currentSectionId);
        if (currentSection) {
          searchableCalculators = currentSection.calculators.map((calc) => ({
            section: currentSection.id,
            calculator: calc,
          }));
        }
      } else {
        // Поиск по всем категориям
        searchableCalculators = getAllCalculators().map((calc) => {
          const section = SECTIONS.find((s) => s.calculators.includes(calc));
          return {
            section: section?.id || '',
            calculator: calc,
          };
        });
      }

      if (searchableCalculators) {
        const filtered = searchableCalculators
          .filter(
            (calc) =>
              calc.calculator.title
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              calc.calculator.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              calc.calculator.tags.some((tag: string) =>
                tag.toLowerCase().includes(searchQuery.toLowerCase())
              )
          )
          .slice(0, 8); // Ограничиваем результаты

        setResults(filtered);
      }

      setIsLoading(false);
    }, 300);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  const handleResultClick = (sectionId: string, calculatorId: string) => {
    navigate(`/${sectionId}/${calculatorId}`);
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) {
      const firstResult = results[0];
      handleResultClick(firstResult.section, firstResult.calculator.id);
    }
  };

  const toggleSearch = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setQuery('');
      setResults([]);
    }
  };

  // Генерируем placeholder в зависимости от контекста
  const getPlaceholder = () => {
    if (currentSectionId && currentSectionId !== '') {
      const section = SECTIONS.find((s) => s.id === currentSectionId);
      return section
        ? `Поиск в ${section.title.toLowerCase()}...`
        : placeholder;
    }
    return placeholder;
  };

  if (variant === 'header') {
    return (
      <div className={styles.searchContainer} ref={searchRef}>
        <button
          className={styles.searchToggle}
          onClick={toggleSearch}
          aria-label="Открыть поиск"
        >
          🔍
        </button>

        {isOpen && (
          <div className={styles.searchDropdown}>
            <form onSubmit={handleSubmit} className={styles.searchForm}>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder={getPlaceholder()}
                className={styles.searchInput}
              />
            </form>

            {query && (
              <div className={styles.searchResults}>
                {isLoading ? (
                  <div className={styles.loading}>
                    <span>Поиск...</span>
                  </div>
                ) : results.length > 0 ? (
                  <div className={styles.resultsList}>
                    {results.map((result, index) => (
                      <button
                        key={`${result.section}-${result.calculator.id}`}
                        className={styles.resultItem}
                        onClick={() =>
                          handleResultClick(
                            result.section,
                            result.calculator.id
                          )
                        }
                      >
                        <span className={styles.resultIcon}>
                          {result.calculator.icon}
                        </span>
                        <div className={styles.resultContent}>
                          <span className={styles.resultTitle}>
                            {result.calculator.title}
                          </span>
                          <span className={styles.resultSection}>
                            {
                              SECTIONS.find((s) => s.id === result.section)
                                ?.title
                            }
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className={styles.noResults}>
                    <span>Ничего не найдено</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Вариант для страниц
  return (
    <div className={styles.pageSearch}>
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <div className={styles.searchInputWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={getPlaceholder()}
            className={styles.pageSearchInput}
          />
          {query && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={() => {
                setQuery('');
                setResults([]);
              }}
            >
              ✕
            </button>
          )}
        </div>
      </form>

      {query && results.length > 0 && (
        <div className={styles.pageResults}>
          <h3>Результаты поиска:</h3>
          <div className={styles.pageResultsList}>
            {results.map((result) => (
              <div
                key={`${result.section}-${result.calculator.id}`}
                className={styles.pageResultItem}
                onClick={() =>
                  handleResultClick(result.section, result.calculator.id)
                }
              >
                <span className={styles.resultIcon}>
                  {result.calculator.icon}
                </span>
                <div className={styles.resultContent}>
                  <span className={styles.resultTitle}>
                    {result.calculator.title}
                  </span>
                  <span className={styles.resultDescription}>
                    {result.calculator.description}
                  </span>
                  <span className={styles.resultSection}>
                    {SECTIONS.find((s) => s.id === result.section)?.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
