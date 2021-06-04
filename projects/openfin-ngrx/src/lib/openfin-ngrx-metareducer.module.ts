import { NgModule } from '@angular/core';
import { ActionReducer, MetaReducer, META_REDUCERS } from '@ngrx/store';
import { OpenfinNgrxMetareducerService } from './openfin-ngrx-metareducer.service';

function metaReducerFactory(metareducerService: OpenfinNgrxMetareducerService): MetaReducer<any> {
  return (reducer: ActionReducer<any>) => (state, action) => {
    if (metareducerService.processStoreAction(action)) {
      return reducer(state, action);
    }

    return state;
  };
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
