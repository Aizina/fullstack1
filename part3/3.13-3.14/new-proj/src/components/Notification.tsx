import React from 'react';

interface NotificationProps {
  message: string | null;
  type: 'success' | 'error' | null;
}

const Notification: React.FC<NotificationProps> = ({ message, type }) => {
  if (message === null) {
    return null;
  }

  return (
    <div className={`notification ${type}`}>
      {message}
    </div>
  );
};

export default Notification;
