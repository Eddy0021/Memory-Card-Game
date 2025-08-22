import React from 'react';
import styles from './card.module.scss';

interface CardProps {
  value: string;
  isFlipped: boolean;
  isWrong?: boolean;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({ value, isFlipped, isWrong, onClick }) => {
  return (
    <div
      role="button"
      className={`${styles.card} ${isFlipped ? styles.flipped : ''} ${isWrong ? styles.shake : ''}`}
      onClick={onClick}
    >

      <div className={styles.cardInner}>
        <div className={styles.cardFront}>
          <div className={styles.cardFrontCover}>
            <span>
              ?
            </span>
          </div>
        </div>
        {
          isFlipped ? (
            <div className={styles.cardBack}>
              <div className={styles.cardBackCover}>
                <i className={value} role="img"></i>
              </div>
            </div>
          ) : <div></div>
        }
      </div>
      
    </div>
  );
};

export default Card;