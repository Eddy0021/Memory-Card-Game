import React, { useState } from 'react';
import { Tooltip } from 'react-tooltip';
import styles from './settings.module.scss';

interface SettingsProps {
  onApply: (pairs: number, time: number, maxMistakes: number | null) => void;
  onClose: () => void;
  currentSettings: {
    pairs: number;
    time: number;
    maxMistakes: number | null;
  };
}

const SettingsModal: React.FC<SettingsProps> = ({ onApply, onClose, currentSettings }) => {
  const [pairCount, setPairCount] = useState(currentSettings.pairs);
  const [countdownTime, setCountdownTime] = useState(currentSettings.time);
  //const [maxMistakes, setMaxMistakes] = useState<number | null>(currentSettings.maxMistakes);

  const [isPairInvalid, setPairError] = useState<boolean>(false);
  const [isCountdownInvalid, setCountdownError] = useState<boolean>(false);

  const handleChange = (e: any, type: string) => {
    const value = e.target.value;

    switch (type) {
      case "pair":
        if (value === '' || (Number(value) > 0 && !isNaN(Number(value)))) setPairCount(value);
        break;
      case "countdown":
        if (value === '' || (Number(value) > 0 && !isNaN(Number(value)))) setCountdownTime(value);
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let isValid = true;

    if (!pairCount || Number(pairCount) <= 0 || isNaN(Number(pairCount))) {
      setPairError(true);
      isValid = false;
    } else {
      setPairError(false);
    }

    if (!countdownTime || Number(countdownTime) <= 0 || isNaN(Number(countdownTime))) {
      setCountdownError(true);
      isValid = false;
    } else {
      setCountdownError(false);
    }

    if (isValid) {
      onApply(Number(pairCount), Number(countdownTime), Number(0));
      onClose();
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Game Settings</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.modal_row}>
            <label htmlFor="pairCount">Number of pairs:</label>
            <input
              id='pairCount'
              type="number"
              min={2}
              max={565}
              value={pairCount}
              onChange={(e) => handleChange(e, 'pair')}
              className={isPairInvalid ? styles.red_border : ""}
            />
          </div>

          <div className={styles.modal_row}>
            <label htmlFor="countdownTime">Countdown time (s):</label>
            <input
              id='countdownTime'
              type="number"
              min={10}
              max={300}
              value={countdownTime}
              onChange={(e) => handleChange(e, 'countdown')}
              className={isCountdownInvalid ? styles.red_border : ""}
            />
          </div>

          {/* <div className={styles.modal_row}>
            <label htmlFor="maxMistakes">Max bad guesses (optional):
              <i
                className={`fa-solid fa-circle-info ${styles.info_icon}`}
                data-tooltip-content="Leave empty for unlimited or set 0"
                data-tooltip-id="my-tooltip"
              ></i>
              <Tooltip id="my-tooltip" place="top" />
            </label>
            <input
              id='maxMistakes'
              type="number"
              placeholder=""
              value={maxMistakes ?? ''}
              onChange={(e) =>
                setMaxMistakes(e.target.value ? Number(e.target.value) : null)
              }
            />
          </div> */}

          <div className={styles.actions}>
            <button type="submit">Save Settings</button>
            <button type="button" onClick={onClose} className={styles.cancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;