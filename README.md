# OpenfinNgrx

## Motivation

Synchronizing multiple OpenFin windows to a single state or in some cases multiple states is a difficult task which results in complex management and repetitive code.

Implementing such a communication solution for multiple windows that transfer a decent amount of data between them takes a lot of effort, especially if you have multiple states that are shared.
Basically you will find yourself building a rest API.

### The solution

OpenfinNgrx offers an easy to use solution. It seamlessly dispatches actions and selects data from states across multiple windows.

##Usge:
OpenfinNgrx delivers an Angular service with the following methods:

`dispatchToParent` - Dispatch NGRX action to the window parent.

`dispatchToWindow` - Dispatch NGRX action to a specific Openfin window that matches the given window name.

`dispatchToRoute` - Dispatch NGRX action to all windows on the specific route.

`selectFromWindow` - select data from the state of the window that matches the given window name.

`selectFromParent` - select data from parent window state.

## change detection

By default NgZone isn't aware of the OpenFin IAB.
This may cause issues when messages from IAB are received and the change detection isn't triggered.
OpenfinNgrx takes care of this problem by triggering the Angular change detection after every action that affects the window such as dispatching an action received from another window or receiving data from another window's state.

## example

Dispatch increment action to the parent window's state.

```typescript
export class ChildWindowComponent {
  constructor(private openfinNgrxService: OpenfinNgrxService) {}

  increaseCounterOnParentWindow(increaseBy) {
    this.openfinNgrxService.dispatchToParent(
      incrementAction({ paylaod: increaseBy })
    );
  }
}
```

ElectronNgrx will dispatch the action to the parent window's state, assuring that the Angular change detection will be triggered on the parent window.

## Demo

To clone and run the demo you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/28StoneConsulting/openfin-ngrx.git
# Go into the repository
cd openfin-ngrx
# Install dependencies
npm install
# Run the the demo
npm start
```
