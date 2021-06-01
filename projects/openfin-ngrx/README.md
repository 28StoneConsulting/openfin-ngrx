# ElectronNgrx

**ElectronNgrx** is a library for dispatching NGRX actions between different Electron windows on a multi-window Electron Apps.

The library supports the following API methods:

`dispatchToParent` - Dispatch NGRX action data through the window's parent.

`dispatchToId`  - Dispatch NGRX action data to a specific Electron window by providing the destination window's ID.

`dispatchToRoute`  - Dispatch NGRX action data to a specific Route providing the destination route's details.



## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.
