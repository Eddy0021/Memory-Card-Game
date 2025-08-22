import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { resetGame } from '../../store/slices/gameSlice';
import React from 'react';
import styles from './navbar.module.scss';
import logo from '../../assets/images/logo.png';

const Navbar: React.FC = () => {
  const { matches, mistakes, timeLeft, status } = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();

  const handleResetClick = () => {
    dispatch(resetGame());
  };

  return (
    <div className={styles.navbar}>
      <div className={`${styles.container} ${status === 'idle' ? 'logo-only' : ''}`}>
        <div className={styles.logo}>
          <img src={logo} alt='logo' />
        </div>

        {status === 'playing' && (
          <>
            <div className={styles.centerStats}>
              <span className={styles.timer}>{timeLeft}</span>
              <div className={styles.stats}>
                <div>
                  <span className={styles.value}>{matches}</span>
                  <span className={styles.label}>Points</span>           
                </div>
              </div>
            </div>
            <div className={styles.options}>
              <i role="button" onClick={handleResetClick} className={`fa-solid fa-repeat ${styles.resetButton}`}></i>
            </div>
          </>
        )}     
      </div>
    </div>
  );
};

export default Navbar;