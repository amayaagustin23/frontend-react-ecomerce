import { ThemeConfig, theme } from 'antd';

export const lightTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#00bcd4',
    colorBgBase: '#eceff1',
    colorTextBase: '#37474f',
    colorBgLayout: '#eeeeee',
    borderRadius: 10,
    fontFamily: 'Inter, sans-serif',
    fontSize: 14,
  },
  components: {
    Menu: {
      itemSelectedColor: '#ffffff',
      itemSelectedBg: '#0097a7',
      itemBorderRadius: 6,
    },
    Button: { borderRadius: 8 },
    Card: { headerHeight: 48 },
    Input: { borderRadius: 6 },
  },
};

export const darkTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#00bcd4',
    colorBgBase: '#263238',
    colorTextBase: '#eceff1',
    colorBgLayout: '#2e4b59',
    borderRadius: 10,
    fontFamily: 'Inter, sans-serif',
    fontSize: 14,
  },
  components: {
    Menu: {
      itemSelectedColor: '#ffffff',
      itemSelectedBg: '#0097a7',
      itemBorderRadius: 6,
    },
    Button: { borderRadius: 8 },
    Card: { headerHeight: 48 },
    Input: { borderRadius: 6 },
  },
};
