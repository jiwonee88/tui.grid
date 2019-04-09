import { OptGrid } from './types';
import { createStore } from './store/create';
import { Root } from './view/root';
import { h, render } from 'preact';
import { createDispatcher, Dispatch } from './dispatch/create';
import { Store } from './store/types';

if ((module as any).hot) {
  require('preact/devtools');
}

export default class Grid {
  private store: Store;
  private dispatch: Dispatch;

  constructor(options: OptGrid) {
    const { el } = options;
    const store = createStore(options);
    const dispatch = createDispatcher(store);

    this.store = store;
    this.dispatch = dispatch;

    // @TODO: Only for Development env
    (window as any).store = store;

    render(<Root store={store} dispatch={dispatch} rootElement={el} />, el);
  }

  setWidth(width: number) {
    this.dispatch('setWidth', width, false);
  }

  setHeight(height: number) {
    this.dispatch('setHeight', height);
  }

  setBodyHeight(bodyHeight: number) {
    this.dispatch('setBodyHeight', bodyHeight);
  }
}