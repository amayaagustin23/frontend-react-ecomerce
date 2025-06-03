import { Button, Tooltip } from 'antd';
import { SunFilled, SunOutlined } from '@ant-design/icons';
import { useTheme } from '@/context/Theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import styles from './ThemeToggle.module.scss';

const ThemeToggle = () => {
  const { mode, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const isDark = mode === 'dark';

  return (
    <Tooltip title={t(isDark ? 'theme.light' : 'theme.dark')}>
      <Button
        type="text"
        shape="circle"
        icon={
          isDark ? (
            <SunOutlined className={styles.icon} />
          ) : (
            <SunFilled className={styles.icon} />
          )
        }
        onClick={toggleTheme}
        aria-label={t('theme.toggle')}
      />
    </Tooltip>
  );
};

export default ThemeToggle;
