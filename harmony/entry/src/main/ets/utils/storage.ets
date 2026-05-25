import { preferences } from '@kit.ArkData';
import { Context } from '@kit.AbilityKit';

const STORE_NAME = 'app_preferences';

export class StorageUtil {
  private static context: Context | null = null;

  static init(context: Context): void {
    StorageUtil.context = context;
  }

  private static getContext(): Context {
    if (!StorageUtil.context) {
      throw new Error('StorageUtil not initialized. Call StorageUtil.init(context) first.');
    }
    return StorageUtil.context;
  }

  static async getString(key: string): Promise<string | null> {
    try {
      const prefs = await preferences.getPreferences(StorageUtil.getContext(), STORE_NAME);
      const value = prefs.getSync(key, '') as string;
      return value || null;
    } catch (err) {
      console.error(`StorageUtil.getString error for key "${key}":`, JSON.stringify(err));
      return null;
    }
  }

  static async setString(key: string, value: string): Promise<void> {
    try {
      const prefs = await preferences.getPreferences(StorageUtil.getContext(), STORE_NAME);
      await prefs.put(key, value);
      await prefs.flush();
    } catch (err) {
      console.error(`StorageUtil.setString error for key "${key}":`, JSON.stringify(err));
    }
  }

  static async remove(key: string): Promise<void> {
    try {
      const prefs = await preferences.getPreferences(StorageUtil.getContext(), STORE_NAME);
      await prefs.delete(key);
      await prefs.flush();
    } catch (err) {
      console.error(`StorageUtil.remove error for key "${key}":`, JSON.stringify(err));
    }
  }

  static async clear(): Promise<void> {
    try {
      const prefs = await preferences.getPreferences(StorageUtil.getContext(), STORE_NAME);
      await prefs.clear();
      await prefs.flush();
    } catch (err) {
      console.error('StorageUtil.clear error:', JSON.stringify(err));
    }
  }
}
