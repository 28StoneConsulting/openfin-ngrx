import createIPCMock from 'electron-mock-ipc';
import {EventEmitter} from 'events';

const windowIdToEventEmitter = {};

export const defineEventEmitterToWindowId = (windowId: number, eventEmitter: EventEmitter) => {
  windowIdToEventEmitter[windowId] = eventEmitter;
};

// this function exist because rxjs from event get only original event emitter
const getIpcAsEmitter = (): { ipcMain: EventEmitter; ipcRenderer: EventEmitter } => {
  const {ipcRenderer: originIpcRenderer, ipcMain: originIpcMain} = createIPCMock();
  (originIpcRenderer.emitter as any).send = originIpcRenderer.send.bind(originIpcRenderer);
  return {ipcRenderer: originIpcRenderer.emitter, ipcMain: originIpcMain.emitter};
};

export const getElectronMock = () => {
  const {ipcRenderer, ipcMain} = getIpcAsEmitter();
  let mockWindowId = 0;
  return {
    setWindowId(id: number) {
      mockWindowId = id;
    },
    ipcRenderer,
    remote: {
      ipcMain,
      BrowserWindow: {
        fromId: (id) => ({
          webContents: {send: (event, data) => windowIdToEventEmitter[id].emit(event, null, data)}
        })
      },
      getCurrentWindow: () => ({
        get id() {
          return mockWindowId;
        },
        getParentWindow: () => ({
          webContents: {
            send: (eventName, data) => {
              ipcRenderer.emit(eventName, null, data);
            }
          }
        })
      })
    }
  };
};
