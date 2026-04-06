// import { createMMKV } from "react-native-mmkv";

// export const storage = createMMKV();

// // ── Helpers بنفس interface الـ AsyncStorage ──
// export const Storage = {
//   set: (key: string, value: string | number | boolean) => {
//     storage.set(key, value);
//   },

//   getString: (key: string): string | undefined => {
//     return storage.getString(key);
//   },

//   getObject: <T>(key: string): T | null => {
//     const raw = storage.getString(key);
//     if (!raw) return null;
//     try {
//       return JSON.parse(raw) as T;
//     } catch {
//       return null;
//     }
//   },

//   setObject: (key: string, value: unknown) => {
//     storage.set(key, JSON.stringify(value));
//   },

//   delete: (key: string) => {
//     storage.delete(key);
//   },

//   contains: (key: string): boolean => {
//     return storage.contains(key);
//   },

//   clearAll: () => {
//     storage.clearAll();
//   },
// };
