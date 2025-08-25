import React from 'react';
import styles from './Logo.module.scss';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', className = '' }) => {
  const sizeMap = {
    small: 32,
    medium: 48,
    large: 64,
  };

  const width = sizeMap[size];
  const height = width;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 64 64"
      className={`${styles.logo} ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Основной фон */}
      <rect
        x="8"
        y="8"
        width="48"
        height="48"
        rx="12"
        fill="url(#gradient)"
        stroke="url(#strokeGradient)"
        strokeWidth="2"
      />

      {/* Экран калькулятора */}
      <rect
        x="16"
        y="16"
        width="32"
        height="16"
        rx="4"
        fill="var(--gray-50)"
        stroke="var(--gray-200)"
        strokeWidth="1"
      />

      {/* Цифры на экране */}
      <text
        x="32"
        y="28"
        textAnchor="middle"
        fill="var(--gray-700)"
        fontSize="12"
        fontFamily="monospace"
        fontWeight="600"
      >
        123.45
      </text>

      {/* Кнопки */}
      <circle cx="24" cy="40" r="3" fill="var(--primary-500)" />
      <circle cx="32" cy="40" r="3" fill="var(--primary-500)" />
      <circle cx="40" cy="40" r="3" fill="var(--primary-500)" />
      <circle cx="48" cy="40" r="3" fill="var(--primary-500)" />

      {/* Плюс */}
      <g className={styles.plusIcon}>
        <circle
          cx="56"
          cy="16"
          r="8"
          fill="var(--primary-500)"
          className={styles.plusCircle}
        />
        <path
          d="M52 16h8M56 12v8"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          className={styles.plusSymbol}
        />
      </g>

      {/* Градиенты */}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--primary-500)" />
          <stop offset="100%" stopColor="var(--primary-700)" />
        </linearGradient>
        <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--primary-300)" />
          <stop offset="100%" stopColor="var(--primary-600)" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Logo;
