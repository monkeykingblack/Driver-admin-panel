import type { ConnectionReceiveRequest, Socket } from 'sharedb/lib/sharedb';

import { useEffect, useMemo, useRef, useState } from 'react';

import ReconnectingWebSocket from 'reconnecting-websocket';
import { Connection } from 'sharedb/lib/client';
import { toast } from 'sonner';

import { HttpError, HttpErrorCode } from '~/libs';

export function getWsPath() {
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${wsProtocol}//${window.location.host}/socket`;
}

const shareDbErrorHandler = (error: unknown) => {
  const httpError = new HttpError(error as string, 500);
  const { code, message } = httpError;
  if (code === HttpErrorCode.UNAUTHORIZED) {
    window.location.href = `/auth/login?redirect=${encodeURIComponent(window.location.href)}`;
    return;
  }

  toast.warning('Socket Error', { description: `${code}: ${message}` });
};

export const useConnection = (path?: string) => {
  const [connected, setConnected] = useState(false);
  const connectionRef = useRef<Connection | null>(null);

  useEffect(() => {
    if (!connectionRef.current && typeof window === 'object') {
      const socket = new ReconnectingWebSocket(path || getWsPath());
      connectionRef.current = new Connection(socket as Socket);
    }

    const connection = connectionRef.current;
    if (!connection) {
      return;
    }

    let pingInterval: ReturnType<typeof setInterval>;
    const onConnected = () => {
      setConnected(true);
      pingInterval = setInterval(() => connection.ping(), 1000 * 10);
    };
    const onDisconnected = () => {
      setConnected(false);
      if (pingInterval) {
        clearInterval(pingInterval);
      }
    };
    const onReceive = (request: ConnectionReceiveRequest) => {
      if (request.data.error) {
        shareDbErrorHandler(request.data.error);
      }
    };

    connection.on('connected', onConnected);
    connection.on('disconnected', onDisconnected);
    connection.on('closed', onDisconnected);
    connection.on('error', shareDbErrorHandler);
    connection.on('receive', onReceive);

    return () => {
      if (pingInterval) {
        clearInterval(pingInterval);
      }
      connection.removeListener('connected', onConnected);
      connection.removeListener('disconnected', onDisconnected);
      connection.removeListener('closed', onDisconnected);
      connection.removeListener('error', shareDbErrorHandler);
      connection.removeListener('receive', onReceive);
      connection.close();
      connectionRef.current = null;
    };
  }, [path]);

  return useMemo(() => {
    return { connection: connectionRef.current || undefined, connected };
  }, [connected]);
};
