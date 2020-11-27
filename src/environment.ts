const httpProtocol = process.env.REACT_APP_HTTP_PROTOCOL
const websocketProtocol = process.env.REACT_APP_WS_PROTOCOL
const serverUrl = process.env.REACT_APP_SERVER_URL

export const httpServer = `${httpProtocol}://${serverUrl}`;
export const websocketServer = `${websocketProtocol}://${serverUrl}`;