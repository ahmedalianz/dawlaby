import { Colors } from "@/constants/colors";
import { HistoryContentView, HistoryItem } from "@/types";
import React from "react";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import EmptyState from "./EmptyState";
import GridCard from "./GridCard";
import HistoryListSeparator from "./HistoryListSeparator";
import ListCard from "./ListCard";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48 - 12) / 2;

const HistoryContent = ({
  view,
  items,
  loading,
  fadeAnim,
  handleDelete,
}: {
  view: HistoryContentView;
  items: HistoryItem[];
  loading: boolean;
  fadeAnim: SharedValue<number>;
  handleDelete: (id: string) => void;
}) => {
  const fadeStyle = useAnimatedStyle(() => {
    return { opacity: fadeAnim.value };
  });

  if (loading) {
    return (
      <View style={styles.loadingState}>
        {[1, 2, 3, 4].map((i) => (
          <View testID="skeleton" key={i} style={styles.skeleton} />
        ))}
      </View>
    );
  }

  if (items.length === 0) {
    return <EmptyState />;
  }

  return (
    <Animated.View style={{ flex: 1, ...fadeStyle }}>
      {view === HistoryContentView.Grid ? (
        <FlatList
          key="grid"
          data={items}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={{ gap: 12 }}
          renderItem={({ item, index }) => (
            <GridCard item={item} index={index} handleDelete={handleDelete} />
          )}
        />
      ) : (
        <FlatList
          key="list"
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ListCard item={item} handleDelete={handleDelete} />
          )}
          ItemSeparatorComponent={HistoryListSeparator}
        />
      )}
    </Animated.View>
  );
};

export default HistoryContent;

const styles = StyleSheet.create({
  loadingState: {
    marginTop: 70,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingHorizontal: 24,
  },
  skeleton: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.35,
    borderRadius: 14,
    backgroundColor: Colors.surfaceContainerHigh,
    opacity: 0.5,
  },
  gridContent: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  listContent: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
});
