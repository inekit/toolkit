import React, { useState } from 'react';
import styles from './BookmarkWidget.module.scss';

interface BookmarkWidgetProps {
  variant?: 'header' | 'page';
}

const BookmarkWidget: React.FC<BookmarkWidgetProps> = ({
  variant = 'header',
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleBookmark = () => {
    if (navigator.share) {
      // Используем Web Share API для мобильных устройств
      navigator.share({
        title: document.title,
        url: window.location.href,
      });
    } else if (navigator.clipboard) {
      // Копируем ссылку в буфер обмена
      navigator.clipboard.writeText(window.location.href);
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    } else {
      // Fallback для старых браузеров
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    }
  };

  const handleAddToBookmarks = () => {
    if (window.sidebar && window.sidebar.addPanel) {
      // Firefox
      window.sidebar.addPanel(document.title, window.location.href, '');
    } else if (window.external && 'AddFavorite' in window.external) {
      // IE
      window.external.AddFavorite(window.location.href, document.title);
    } else {
      // Современные браузеры
      if (navigator.userAgent.indexOf('Chrome') !== -1) {
        alert('Нажмите Ctrl+D (или Cmd+D на Mac) для добавления в закладки');
      } else if (navigator.userAgent.indexOf('Firefox') !== -1) {
        alert('Нажмите Ctrl+D (или Cmd+D на Mac) для добавления в закладки');
      } else if (navigator.userAgent.indexOf('Safari') !== -1) {
        alert('Нажмите Cmd+D для добавления в закладки');
      } else {
        alert('Нажмите Ctrl+D для добавления в закладки');
      }
    }
  };

  if (variant === 'header') {
    return (
      <div className={styles.bookmarkContainer}>
        <button
          className={`${styles.bookmarkBtn} ${styles.header}`}
          onClick={handleBookmark}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          aria-label="Поделиться страницей"
          title="Поделиться страницей"
        >
          📤
        </button>
        {showTooltip && (
          <div className={styles.tooltip}>
            {navigator.share ? 'Поделиться' : 'Ссылка скопирована!'}
          </div>
        )}
      </div>
    );
  }

  // Вариант для страниц
  return (
    <div className={styles.pageBookmark}>
      <div className={styles.bookmarkActions}>
        <button
          className={styles.bookmarkBtn}
          onClick={handleAddToBookmarks}
          title="Добавить в закладки браузера"
        >
          🔖 Добавить в закладки
        </button>
        <button
          className={styles.shareBtn}
          onClick={handleBookmark}
          title="Поделиться страницей"
        >
          📤 Поделиться
        </button>
      </div>
      {showTooltip && (
        <div className={styles.tooltip}>
          {navigator.share ? 'Поделиться' : 'Ссылка скопирована!'}
        </div>
      )}
    </div>
  );
};

export default BookmarkWidget;
