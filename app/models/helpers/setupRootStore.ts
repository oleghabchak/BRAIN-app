/**
 * This file is where we do "rehydration" of your RootStore from AsyncStorage.
 * This lets you persist your state between app launches.
 *
 * Navigation state persistence is handled in navigationUtilities.tsx.
 *
 * Note that Fast Refresh doesn't play well with this file, so if you edit this,
 * do a full refresh of your app instead.
 *
 * @refresh reset
 */
import { applySnapshot, IDisposer, onSnapshot } from 'mobx-state-tree';

import * as storage from '@/utils/storage';

import { RootStore, RootStoreSnapshot } from '../RootStore';

/**
 * The key we'll be saving our state as within async storage.
 */
const ROOT_STATE_STORAGE_KEY = 'root-v1';

/**
 * Setup the root state.
 */
let _disposer: IDisposer | undefined;
export async function setupRootStore(rootStore: RootStore) {
  let restoredState: RootStoreSnapshot | undefined | null;

  try {
    restoredState = ((await storage.load(ROOT_STATE_STORAGE_KEY)) ?? {}) as RootStoreSnapshot;
    applySnapshot(rootStore, restoredState);
  } catch (e) {
    if (__DEV__) {
      if (e instanceof Error) console.error(e.message);
    }
  }

  if (_disposer) _disposer();

  _disposer = onSnapshot(rootStore, (snapshot) => storage.save(ROOT_STATE_STORAGE_KEY, snapshot));

  const unsubscribe = () => {
    _disposer?.();
    _disposer = undefined;
  };

  return { rootStore, restoredState, unsubscribe };
}

// @mst remove-file
