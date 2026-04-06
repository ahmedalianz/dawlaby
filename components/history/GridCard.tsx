import AppText from "@/components/common/AppText";
import { Colors } from "@/constants/colors";
import { GridCardItem } from "@/types";
import { formatDate } from "@/utils/history";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48 - 12) / 2;

const GridCard = ({ item, index, handleDelete }: GridCardItem) => {
  const isOdd = index % 2 !== 0;
  return (
    <TouchableOpacity
      style={[styles.gridCard, isOdd && { marginTop: 24 }]}
      activeOpacity={0.88}
      onLongPress={() => handleDelete(item.id)}
      onPress={() =>
        router.push({
          pathname: "/history/[id]",
          params: {
            id: item.id,
          },
        })
      }
    >
      <Image
        source={{ uri: item.imageUri as string }}
        style={styles.gridImage}
      />
      <LinearGradient
        colors={["transparent", Colors.blackOverlayHeavy]}
        style={styles.gridGradient}
      >
        <View style={styles.vibePill}>
          <AppText style={styles.vibePillText}>{item.styleVibe}</AppText>
        </View>
        <AppText style={styles.gridDate}>{formatDate(item.date)}</AppText>
      </LinearGradient>
    </TouchableOpacity>
  );
};
export default GridCard;
const styles = StyleSheet.create({
  gridCard: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.45,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: Colors.surfaceContainerHigh,
  },
  gridImage: { width: "100%", height: "100%", position: "absolute" },
  gridGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    paddingBottom: 12,
    paddingTop: 32,
    gap: 4,
  },
  vibePill: {
    alignSelf: "flex-start",
    backgroundColor: Colors.primaryAlpha20,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.primaryAlpha35,
  },
  vibePillText: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  gridDate: {
    color: Colors.onSurfaceAlpha60,
    fontSize: 10,
  },
});
