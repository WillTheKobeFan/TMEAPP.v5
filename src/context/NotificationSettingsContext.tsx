// src/context/NotificationSettingsContext.tsx

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "@tme_notification_preferences";

export type NotificationSource = {
  id: string;
  organizationId: string;
  organizationName: string;
  leagueType: string;
  leagueName: string;
  dayTime: string;
  enabled: boolean;
};

export type NotificationPreferences = {
  allowNotifications: boolean;
  gameAlerts: boolean;
  scoreResultAlerts: boolean;
  inboxAlerts: boolean;
};

type LegacyNotificationPreferences = {
  allowNotifications?: boolean;
  gameReminders?: boolean;
  gameAlerts?: boolean;
  scoreResultAlerts?: boolean;
  inboxAlerts?: boolean;
};

type StoredNotificationSettings = {
  preferences?: LegacyNotificationPreferences;
  sources?: NotificationSource[];
};

type NotificationSettingsContextValue = {
  preferences: NotificationPreferences;
  sources: NotificationSource[];
  isLoaded: boolean;

  setAllowNotifications: (value: boolean) => void;
  setGameAlerts: (value: boolean) => void;
  setScoreResultAlerts: (value: boolean) => void;
  setInboxAlerts: (value: boolean) => void;

  setSourceEnabled: (
    sourceId: string,
    value: boolean,
  ) => void;

  setAllSourcesEnabled: (
    value: boolean,
    sourceIds?: string[],
  ) => void;

  enabledSourceCount: number;
  enabledOrganizationCount: number;
};

const DEFAULT_PREFERENCES: NotificationPreferences = {
  allowNotifications: true,
  gameAlerts: true,
  scoreResultAlerts: true,
  inboxAlerts: true,
};

const DEFAULT_SOURCES: NotificationSource[] = [
  {
    id: "tme-sunday-am",
    organizationId: "tme",
    organizationName: "TME Social Sports",
    leagueType: "Adult Basketball",
    leagueName: "Sunday League",
    dayTime: "Sunday • AM",
    enabled: true,
  },
  {
    id: "tme-monday-pm",
    organizationId: "tme",
    organizationName: "TME Social Sports",
    leagueType: "Adult Basketball",
    leagueName: "Monday League",
    dayTime: "Monday • PM",
    enabled: false,
  },
  {
    id: "tme-tuesday-pm",
    organizationId: "tme",
    organizationName: "TME Social Sports",
    leagueType: "Adult Basketball",
    leagueName: "Tuesday League",
    dayTime: "Tuesday • PM",
    enabled: false,
  },
  {
    id: "tme-wednesday-pm",
    organizationId: "tme",
    organizationName: "TME Social Sports",
    leagueType: "Adult Basketball",
    leagueName: "Wednesday League",
    dayTime: "Wednesday • PM",
    enabled: true,
  },
  {
    id: "pickup-adult-sunday",
    organizationId: "pickup",
    organizationName: "Pickup Basketball USA",
    leagueType: "Adult Men",
    leagueName: "Adult Sunday",
    dayTime: "Sunday • PM",
    enabled: true,
  },
  {
    id: "pickup-teen-tuesday",
    organizationId: "pickup",
    organizationName: "Pickup Basketball USA",
    leagueType: "Teen League",
    leagueName: "Ages 15–18",
    dayTime: "Tuesday • PM",
    enabled: true,
  },
  {
    id: "pickup-youth-friday-9-11",
    organizationId: "pickup",
    organizationName: "Pickup Basketball USA",
    leagueType: "Youth",
    leagueName: "Ages 9–11",
    dayTime: "Friday • PM",
    enabled: false,
  },
  {
    id: "pickup-youth-friday-12-14",
    organizationId: "pickup",
    organizationName: "Pickup Basketball USA",
    leagueType: "Youth",
    leagueName: "Ages 12–14",
    dayTime: "Friday • PM",
    enabled: false,
  },
  {
    id: "taj-saturday-youth",
    organizationId: "taj",
    organizationName: "Taj Hill Hoops",
    leagueType: "Youth Basketball",
    leagueName: "Saturday Youth",
    dayTime: "Saturday • AM",
    enabled: true,
  },
];

const NotificationSettingsContext =
  createContext<NotificationSettingsContextValue | null>(
    null,
  );

export function NotificationSettingsProvider({
  children,
}: PropsWithChildren) {
  const [preferences, setPreferences] =
    useState<NotificationPreferences>(
      DEFAULT_PREFERENCES,
    );

  const [sources, setSources] =
    useState<NotificationSource[]>(
      DEFAULT_SOURCES,
    );

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      try {
        const savedValue =
          await AsyncStorage.getItem(STORAGE_KEY);

        if (!savedValue || !mounted) {
          return;
        }

        const parsed = JSON.parse(
          savedValue,
        ) as StoredNotificationSettings;

        const savedPreferences = parsed.preferences;

        if (savedPreferences) {
          setPreferences({
            allowNotifications:
              savedPreferences.allowNotifications ??
              DEFAULT_PREFERENCES.allowNotifications,

            /*
             * Migration support:
             * older builds stored this as gameReminders.
             */
            gameAlerts:
              savedPreferences.gameAlerts ??
              savedPreferences.gameReminders ??
              DEFAULT_PREFERENCES.gameAlerts,

            scoreResultAlerts:
              savedPreferences.scoreResultAlerts ??
              DEFAULT_PREFERENCES.scoreResultAlerts,

            inboxAlerts:
              savedPreferences.inboxAlerts ??
              DEFAULT_PREFERENCES.inboxAlerts,
          });
        }

        if (Array.isArray(parsed.sources)) {
          const savedSources = new Map<
            string,
            NotificationSource
          >(
            parsed.sources.map(
              (source: NotificationSource) => [
                source.id,
                source,
              ],
            ),
          );

          setSources(
            DEFAULT_SOURCES.map(
              (defaultSource: NotificationSource) => {
                const savedSource =
                  savedSources.get(defaultSource.id);

                return savedSource
                  ? {
                      ...defaultSource,
                      enabled: savedSource.enabled,
                    }
                  : defaultSource;
              },
            ),
          );
        }
      } catch (error) {
        console.warn(
          "Unable to load notification preferences:",
          error,
        );
      } finally {
        if (mounted) {
          setIsLoaded(true);
        }
      }
    }

    loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const value = JSON.stringify({
      preferences,
      sources,
    });

    AsyncStorage.setItem(
      STORAGE_KEY,
      value,
    ).catch((error: unknown) => {
      console.warn(
        "Unable to save notification preferences:",
        error,
      );
    });
  }, [isLoaded, preferences, sources]);

  const enabledSourceCount = useMemo(
    () =>
      sources.filter(
        (source: NotificationSource) =>
          source.enabled,
      ).length,
    [sources],
  );

  const enabledOrganizationCount = useMemo(() => {
    const organizationIds = new Set<string>();

    sources.forEach(
      (source: NotificationSource) => {
        if (source.enabled) {
          organizationIds.add(
            source.organizationId,
          );
        }
      },
    );

    return organizationIds.size;
  }, [sources]);

  const value = useMemo<
    NotificationSettingsContextValue
  >(
    () => ({
      preferences,
      sources,
      isLoaded,

      setAllowNotifications(nextValue: boolean) {
        setPreferences(
          (
            current: NotificationPreferences,
          ) => ({
            ...current,
            allowNotifications: nextValue,
          }),
        );
      },

      setGameAlerts(nextValue: boolean) {
        setPreferences(
          (
            current: NotificationPreferences,
          ) => ({
            ...current,
            gameAlerts: nextValue,
          }),
        );
      },

      setScoreResultAlerts(nextValue: boolean) {
        setPreferences(
          (
            current: NotificationPreferences,
          ) => ({
            ...current,
            scoreResultAlerts: nextValue,
          }),
        );
      },

      setInboxAlerts(nextValue: boolean) {
        setPreferences(
          (
            current: NotificationPreferences,
          ) => ({
            ...current,
            inboxAlerts: nextValue,
          }),
        );
      },

      setSourceEnabled(
        sourceId: string,
        nextValue: boolean,
      ) {
        setSources(
          (
            current: NotificationSource[],
          ) =>
            current.map(
              (
                source: NotificationSource,
              ) =>
                source.id === sourceId
                  ? {
                      ...source,
                      enabled: nextValue,
                    }
                  : source,
            ),
        );
      },

      setAllSourcesEnabled(
        nextValue: boolean,
        sourceIds?: string[],
      ) {
        const allowedIds = sourceIds
          ? new Set<string>(sourceIds)
          : null;

        setSources(
          (
            current: NotificationSource[],
          ) =>
            current.map(
              (
                source: NotificationSource,
              ) => {
                if (
                  allowedIds &&
                  !allowedIds.has(source.id)
                ) {
                  return source;
                }

                return {
                  ...source,
                  enabled: nextValue,
                };
              },
            ),
        );
      },

      enabledSourceCount,
      enabledOrganizationCount,
    }),
    [
      preferences,
      sources,
      isLoaded,
      enabledSourceCount,
      enabledOrganizationCount,
    ],
  );

  return (
    <NotificationSettingsContext.Provider
      value={value}
    >
      {children}
    </NotificationSettingsContext.Provider>
  );
}

export function useNotificationSettings() {
  const context = useContext(
    NotificationSettingsContext,
  );

  if (!context) {
    throw new Error(
      "useNotificationSettings must be used inside NotificationSettingsProvider.",
    );
  }

  return context;
}