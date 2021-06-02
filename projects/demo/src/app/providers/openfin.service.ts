import { Injectable } from "@angular/core";

@Injectable()
export class OpenfinService {
  isOpenfin = () => {
    return !!(window && window.fin);
  };
}
