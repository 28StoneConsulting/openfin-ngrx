import { NgModule } from '@angular/core';
import { ActionReducer, MetaReducer, META_REDUCERS } from '@ngrx/store';
import { OpenfinNgrxMetareducerService } from './openfin-ngrx-metareducer.service';

export function metaReducerFactory(metareducerService: OpenfinNgrxMetareducerService): MetaReducer<any> {
  function metaReducer(reducer: ActionReducer<any>) {
    return function actionReducer(state, action) {
      if (metareducerService.processStoreAction(action)) {
        return reducer(state, action);
      }

      return state;
    };
  }

  return metaReducer;
}

@NgModule({
  providers: [
    {
      provide: META_REDUCERS,
      deps: [OpenfinNgrxMetareducerService],
      useFactory: metaReducerFactory,
      multi: true,
    },
  ],
})
export class OpenfinNgrxMetareducerModule {}
