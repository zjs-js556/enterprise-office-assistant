import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { type ColorValue, type StyleProp, type TextStyle } from "react-native";

export type IconName = React.ComponentProps<typeof Ionicons>["name"];

interface Props {
  name: IconName;
  size?: number;
  color?: ColorValue;
  style?: StyleProp<TextStyle>;
}

export default function AppIcon({ name, size = 22, color, style }: Props) {
  return <Ionicons name={name} size={size} color={color} style={style} />;
}

// ── Icon name presets ─────────────────────────────────────────────────────────

export const IconNames = {
  // Tab bar
  home: "home-outline" as const,
  homeFilled: "home" as const,
  people: "people-outline" as const,
  peopleFilled: "people" as const,
  folder: "folder-outline" as const,
  folderFilled: "folder" as const,
  desktop: "desktop-outline" as const,
  desktopFilled: "desktop" as const,
  person: "person-outline" as const,
  personFilled: "person" as const,

  // Feature cards
  employees: "people-outline" as const,
  categories: "layers-outline" as const,
  devices: "laptop-outline" as const,
  logs: "document-text-outline" as const,
  profile: "person-circle-outline" as const,
  ai: "chatbubbles-outline" as const,

  // Header actions
  bell: "notifications-outline" as const,
  logout: "log-out-outline" as const,

  // Form icons
  user: "person-outline" as const,
  lock: "lock-closed-outline" as const,
  eye: "eye-outline" as const,
  eyeOff: "eye-off-outline" as const,
  mail: "mail-outline" as const,
  calendar: "calendar-outline" as const,
  clock: "time-outline" as const,
  shield: "shield-checkmark-outline" as const,
  tag: "pricetag-outline" as const,
  refresh: "refresh-outline" as const,

  // Status
  check: "checkmark-circle-outline" as const,
  alert: "alert-circle-outline" as const,
  close: "close-outline" as const,
  arrowBack: "arrow-back" as const,
  arrowForward: "chevron-forward" as const,
  add: "add" as const,
  search: "search-outline" as const,
  edit: "create-outline" as const,
  trash: "trash-outline" as const,

  // Empty / error states
  inbox: "file-tray-outline" as const,
  wifiOff: "wifi-outline" as const,
  package: "cube-outline" as const,
  settings: "settings-outline" as const,
  info: "information-circle-outline" as const,

  // Arrows
  arrowUp: "chevron-up" as const,
  arrowDown: "chevron-down" as const,
  chevronRight: "chevron-forward" as const,

  // Misc
  send: "send" as const,
} as const;
