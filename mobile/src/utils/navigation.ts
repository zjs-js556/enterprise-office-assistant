import { createRef } from "react";

export const navigationRef = createRef<any>();

export function navigate(name: string, params?: any) {
  if (navigationRef.current) {
    navigationRef.current.navigate(name, params);
  }
}
