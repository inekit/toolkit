import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import styles from './Layout.module.scss';
import { useScrollToTop } from '@/hooks/useScrollToTop';

const Layout: React.FC = () => {
  useScrollToTop();
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
