import { createContext, useContext, useEffect, useState } from 'react';

import { RootStore, RootStoreModel } from '../RootStore';
import { setupRootStore } from './setupRootStore';

/**
 * Create the initial (empty) global RootStore instance here.
 *
 * Later, it will be rehydrated in app.tsx with the setupRootStore function.
 *
 * If your RootStore requires specific properties to be instantiated,
 * you can do so here.
 *
 * If your RootStore has a _ton_ of sub-stores and properties (the tree is
 * very large), you may want to use a different strategy than immediately
 * instantiating it, although that should be rare.
 */
const _rootStore = RootStoreModel.create({});

/**
 * The RootStoreContext provides a way to access
 * the RootStore in any screen or component.
 */
const RootStoreContext = createContext<RootStore>(_rootStore);

/**
 * You can use this Provider to specify a *different* RootStore
 * than the singleton version above if you need to. Generally speaking,
 * this Provider & custom RootStore instances would only be used in
 * testing scenarios.
 */
export const RootStoreProvider = RootStoreContext.Provider;

/**
 * A hook that screens and other components can use to gain access to
 * our stores:
 *
 * const rootStore = useStores()
 *
 * or:
 *
 * const { someStore, someOtherStore } = useStores()
 */
export const useStores = () => useContext(RootStoreContext);

/**
 * Used only in the app.tsx file, this hook sets up the RootStore
 * and then rehydrates it. It connects everything with Reactotron
 * and then lets the app know that everything is ready to go.
 * @param {() => void | Promise<void>} callback - an optional callback that's invoked once the store is ready
 * @returns {object} - the RootStore and rehydrated state
 */
export const useInitialRootStore = (callback?: () => void | Promise<void>) => {
  const rootStore = useStores();
  const [rehydrated, setRehydrated] = useState(false);

  useEffect(() => {
    let _unsubscribe: () => void | undefined;
    (async () => {
      const { unsubscribe } = await setupRootStore(rootStore);
      _unsubscribe = unsubscribe;

      // reactotron integration with the MST root store (DEV only)
      if (__DEV__) {
        // @ts-ignore
        console.tron.trackMstNode(rootStore);
      }

      setRehydrated(true);

      if (callback) callback();
    })();

    return () => {
      if (_unsubscribe !== undefined) _unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { rootStore, rehydrated };
};

// @mst remove-file
