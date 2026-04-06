import AppText from "@/components/common/AppText";
import Screen from "@/components/common/Screen";
import TopBar from "@/components/common/TopBar";
import HistoryContent from "@/components/history/HistoryContent";
import { Colors } from "@/constants/colors";
import { HistoryContentView, HistoryItem } from "@/types";
import { clearHistory, deleteHistoryItem, getHistory } from "@/utils/history";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet, View } from "react-native";
import { useSharedValue, withTiming } from "react-native-reanimated";

export default function HistoryScreen() {
  const { t } = useTranslation();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [view, setView] = useState<HistoryContentView>(HistoryContentView.Grid);
  const fadeAnim = useSharedValue(0);
  const [loading, setLoading] = useState(true);

  const handleClearAll = () => {
    Alert.alert(t("history.clearTitle"), t("history.clearDesc"), [
      { text: t("history.cancel"), style: "cancel" },
      {
        text: t("history.clearAll"),
        style: "destructive",
        onPress: async () => {
          await clearHistory();
          setItems([]);
        },
      },
    ]);
  };
  const load = useCallback(async () => {
    setLoading(true);
    const data = await getHistory();
    setItems(data);
    setLoading(false);
    fadeAnim.value = withTiming(1, { duration: 500 });
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = (id: string) => {
    Alert.alert(t("historyDetail.removeTitle"), t("historyDetail.removeDesc"), [
      { text: t("history.cancel"), style: "cancel" },
      {
        text: t("historyDetail.remove"),
        style: "destructive",
        onPress: async () => {
          await deleteHistoryItem(id);
          setItems((prev) => prev.filter((i) => i.id !== id));
        },
      },
    ]);
  };
  return (
    <Screen>
      {/* ── TOP BAR ── */}
      <TopBar
        title={t("history.title")}
        onFirstButtonPress={() =>
          setView((v) =>
            v === HistoryContentView.Grid
              ? HistoryContentView.List
              : HistoryContentView.Grid,
          )
        }
        firstButtonIcon={
          view === HistoryContentView.Grid ? "list-outline" : "grid-outline"
        }
        secondButtonIcon={items.length > 0 ? "trash-outline" : undefined}
        onSecondButtonPress={handleClearAll}
      />
      {/* ── COUNT BADGE ── */}
      {items.length > 0 && (
        <View style={styles.countBadge}>
          <AppText style={styles.countText}>
            {t("history.count", { count: items.length })}
          </AppText>
        </View>
      )}

      {/* Hint: long press to delete */}
      {items.length > 0 && (
        <AppText style={styles.longPressHint}>
          {t("history.longPressHint")}
        </AppText>
      )}

      {/* ── CONTENT ── */}
      <HistoryContent
        view={view}
        items={items}
        loading={loading}
        fadeAnim={fadeAnim}
        handleDelete={handleDelete}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  countBadge: {
    marginTop: 20,
    marginHorizontal: 24,
    marginBottom: 4,
  },
  countText: {
    color: Colors.secondary,
    fontSize: 12,
    letterSpacing: 1,
  },
  longPressHint: {
    color: Colors.secondaryAlpha30,
    fontSize: 11,
    textAlign: "center",
    marginBottom: 8,
  },
});
