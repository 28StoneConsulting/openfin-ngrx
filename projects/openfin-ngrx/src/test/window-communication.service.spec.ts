import { TestBed } from '@angular/core/testing';
import { WindowCommunicationService } from '../lib/window-communication.service';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { communicationChannel } from '../lib/communication-channels';

xdescribe('window communication service', () => {
  // let routerEvents;

  beforeEach(() => {
    /*     routerEvents = new Subject();
    electronMock = getElectronMock();
    (window as any).require = () => electronMock;
    TestBed.configureTestingModule({
      providers: [
        WindowCommunicationService,
        { provide: Router, useValue: { url: "/", events: routerEvents } },
      ],
    });
 */
  });

  it('should be created', () => {
    /*     const service: WindowCommunicationService = TestBed.get(
      WindowCommunicationService
    );
    expect(service).toBeTruthy();
 */
  });

  it('should send to parent', () => {
    /*     const service: WindowCommunicationService = TestBed.get(
      WindowCommunicationService
    );
    const subscriber = jasmine.createSpy();
    const data = "data";

    service.listenToParentChannel().subscribe(subscriber);
    service.sendToParent(data);
    expect(subscriber).toHaveBeenCalledWith({
      data,
      replay: jasmine.any(Function),
    });
 */
  });

  it('should send to window by id', () => {
    /*     const service: WindowCommunicationService = TestBed.get(
      WindowCommunicationService
    );
    const subscriber = jasmine.createSpy();
    const data = "data";
    const windowIdentity = { uuid: 'app_name', name: 'window_name' };
    defineEventEmitterToWindowId(windowIdentity, electronMock.ipcRenderer);
    service.listenToWindowNameChannel().subscribe(subscriber);
    service.sendToWindow(windowIdentity, data);
    expect(subscriber).toHaveBeenCalledWith({
      data,
      replay: jasmine.any(Function),
    });
 */
  });

  it('should send to route', done => {
    /*     const service: WindowCommunicationService = TestBed.get(
      WindowCommunicationService
    );
    const mockData = "data";

    service.listenToRouteChannel().subscribe(({ data }) => {
      expect(data).toBe(mockData);
      done();
    });
    routerEvents.next(new NavigationEnd(1, "/", ""));
    service.sendToRoute("/", mockData);
 */
  });
  describe('should send replay message', () => {
    /*     const windowId = 1;
    const messageId = 2;
    const replayData = "replay";

    it("when id chanel emit message", (done) => {
      const service: WindowCommunicationService = TestBed.get(
        WindowCommunicationService
      );
      defineEventEmitterToWindowId(windowId, electronMock.ipcRenderer);
      electronMock.ipcRenderer.once(
        communicationChannel.replay,
        (event, data) => {
          expect(data).toEqual({ data: replayData, messageId });
          done();
        }
      );
      service.listenToWindowNameChannel().subscribe((message) => {
        message.replay(replayData);
      });
      electronMock.ipcRenderer.emit(communicationChannel.window, [
        {},
        { data: null, senderId: windowId, messageId },
      ]);
 */
  });

  it('when parent chanel emit message', done => {
    /*       const service: WindowCommunicationService = TestBed.get(
        WindowCommunicationService
      );
      defineEventEmitterToWindowId(windowId, electronMock.ipcRenderer);
      electronMock.ipcRenderer.once(
        communicationChannel.replay,
        (event, data) => {
          expect(data).toEqual({ data: replayData, messageId });
          done();
        }
      );
      service.listenToParentChannel().subscribe((message) => {
        message.replay(replayData);
      });
      electronMock.ipcRenderer.emit(communicationChannel.parent, [
        {},
        { data: null, senderId: windowId, messageId },
      ]);
    });
 */
  });

  it('should return replay message', done => {
    /*     const service: WindowCommunicationService = TestBed.get(
      WindowCommunicationService
    );
    const distentionWindowId = 2;
    const replayData = "replay";
    electronMock.setWindowId(1);
    defineEventEmitterToWindowId(distentionWindowId, electronMock.ipcRenderer);
    electronMock.ipcRenderer.once(
      communicationChannel.window,
      (event, data) => {
        return setTimeout(() =>
          electronMock.ipcRenderer.emit(communicationChannel.replay, [
            {},
            {
              data: replayData,
              messageId: data.messageId,
            },
          ])
        );
      }
    );
    service.sendToWindow(distentionWindowId, {}).subscribe((data) => {
      expect(data).toBe(replayData);
      done();
    });
 */
  });
});
