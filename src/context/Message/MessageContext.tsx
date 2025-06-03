import React, { createContext, useContext } from 'react';
import { message } from 'antd';

const MessageContext = createContext<ReturnType<typeof message.useMessage> | null>(null);

export const MessageProvider = ({ children }: { children: React.ReactNode }) => {
  const messageApi = message.useMessage();
  return (
    <MessageContext.Provider value={messageApi}>
      {messageApi[1]}
      {children}
    </MessageContext.Provider>
  );
};

export const useMessageApi = () => {
  const context = useContext(MessageContext);
  if (!context) throw new Error('useMessageApi debe usarse dentro de <MessageProvider>');
  return context[0];
};
