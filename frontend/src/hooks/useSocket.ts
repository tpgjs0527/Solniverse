import React, { useCallback } from "react";
import io, { Socket } from "socket.io-client";

const URL = process.env.REACT_APP_SOCKET_URL;

const sockets: { [key: string]: typeof Socket } = {};

export const useSocket = (
  uuid?: string
): [typeof Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (uuid && sockets[uuid]) {
      sockets[uuid].disconnect();
      delete sockets[uuid];
    }
  }, [uuid]);
  if (!uuid) {
    return [undefined, disconnect];
  }
  if (!sockets[uuid]) {
    sockets[uuid] = io.connect(`${URL}?userKey=${uuid}`, {
      transports: ["websocket"],
    });
    console.info("create Socket", uuid, sockets[uuid]);
  }
  return [sockets[uuid], disconnect];
};
