import axios from 'axios';
import { useToken } from '../contexts/TokenProvider';
import { IToken } from '../types/token';
import { useNotificationStatus } from '../contexts/NotificationStatusProvider';
import { INotification, INotificationStatus } from '../types/notification';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { END_POINT } from '../api/apiAddress';
import { useQuery } from 'react-query';

const NotificationStatus = () => {
  const [notificationStatusList, setNotificationStatusList] = useState<boolean[]>([]);
  const tokenContextObj: IToken | null = useToken();
  const notificationStatusContextObj: INotificationStatus | null = useNotificationStatus();

  useQuery(
    'notificationStatusData',
    async () => {
      return await axios
        .get(`${END_POINT}/notifications`, {
          headers: { Authorization: `bearer ${tokenContextObj?.token}` },
        })
        .then(({ data }) => data);
    },
    {
      onSuccess: (serverData) => {
        const allSeenCheckData = serverData.map((data: INotification) => data.seen);
        setNotificationStatusList(allSeenCheckData);
      },
    }
  );

  const checkNotificationStatus = () => {
    if (notificationStatusList.includes(false)) notificationStatusContextObj?.setNotification(true);
  };

  useEffect(() => {
    checkNotificationStatus();
  }, [notificationStatusList]);

  return <>{notificationStatusContextObj?.notificationStatus && <NotificationDot></NotificationDot>}</>;
};

export default NotificationStatus;

const NotificationDot = styled.div`
  position: absolute;
  top: -0.1875rem;
  border-radius: 50%;
  width: 0.875rem;
  height: 0.875rem;
  background-color: #4caf50;
  box-shadow: 0px 0px 3px #4caf50;
`;
