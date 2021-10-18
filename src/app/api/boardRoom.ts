import * as restify from "restify";
import { IApiController } from "./IApiController";

interface WebSocketWithID {
  id: string;
}
class SocketRegistry implements IApiController {

  // Object to broadcast the updates realtime
  public connectedClients: Map<string, WebSocketWithID> = new Map();
  static instance: SocketRegistry;
  public timerBody = { counter: 0 };

  public async register(HttpServer: restify.Server) {
    try {
      // sockect management for realtime updates example for a new feature...
      // const wss = new Server({
      //   // port: 8080,
      //   server: HttpServer,
      //   clientTracking: true,
      //   perMessageDeflate: {
      //     zlibDeflateOptions: {
      //     // See zlib defaults.
      //     chunkSize: 1024,
      //     memLevel: 7,
      //     level: 3
      //     },
      //     zlibInflateOptions: {
      //     chunkSize: 10 * 1024
      //     },
      //     // Other options settable:
      //     clientNoContextTakeover: true, // Defaults to negotiated value.
      //     serverNoContextTakeover: true, // Defaults to negotiated value.
      //     serverMaxWindowBits: 10, // Defaults to negotiated value.
      //     // Below options specified as default values.
      //     concurrencyLimit: 10, // Limits zlib concurrency for perf.
      //     threshold: 1024 // Size (in bytes) below which messages
      //     // should not be compressed.
      //   }
      // });
    } catch (error) {
      console.log(error);
    }
  }

  public getCurrentTime() {
    return this.timerBody.counter;
  }
  public updateCurrentTime(secs: number) {
    this.timerBody.counter += secs;
    return this.timerBody.counter;
  }
  public resetCurrentTime() {
    this.timerBody.counter = 0;
  }
}

const instance = new SocketRegistry();
Object.freeze(instance);

export default instance;