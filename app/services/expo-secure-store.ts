import * as SecureStore from "expo-secure-store";

export async function SecureStoreSave(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

export async function SecureStoreGet(key: string): Promise<string | null> {
  return await SecureStore.getItemAsync(key);
}

export async function SecureStoreDelete(key: string) {
  await SecureStore.deleteItemAsync(key);
}
