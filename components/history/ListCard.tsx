import AppText from "@/components/common/AppText";
import { Colors } from "@/constants/colors";
import { ListCardItem } from "@/types";
import { formatDate } from "@/utils/history";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

// ── List Card ──
const ListCard = ({ item, handleDelete }: ListCardItem) => (
  <TouchableOpacity
    style={styles.listCard}
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
    <Image source={{ uri: item.imageUri as string }} style={styles.listImage} />
    <View style={styles.listInfo}>
      <View style={styles.vibePillSmall}>
        <AppText style={styles.vibePillText}>{item.styleVibe}</AppText>
      </View>
      <AppText style={styles.listItems} numberOfLines={2}>
        {item.detectedItems.join(" · ")}
      </AppText>
      <AppText style={styles.listNote} numberOfLines={2}>
        {`"${item.stylistNote}"`}
      </AppText>
      <AppText style={styles.listDate}>{formatDate(item.date)}</AppText>
    </View>
    <TouchableOpacity
      style={styles.deleteBtn}
      onPress={() => handleDelete(item.id)}
    >
      <Ionicons name="trash-outline" size={16} color={Colors.errorAlpha60} />
    </TouchableOpacity>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  listCard: {
    flexDirection: "row",
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.outlineVariantAlpha20,
  },
  listImage: { width: 90, height: 120 },
  listInfo: {
    flex: 1,
    padding: 12,
    gap: 6,
    justifyContent: "center",
  },
  vibePillSmall: {
    alignSelf: "flex-start",
    backgroundColor: Colors.primaryAlpha12,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: Colors.primaryAlpha25,
  },
  listItems: {
    color: Colors.onSurface,
    fontSize: 12,
    fontWeight: "500",
  },
  listNote: {
    color: Colors.secondary,
    fontSize: 12,
    lineHeight: 17,
  },
  listDate: {
    color: Colors.secondaryAlpha40,
    fontSize: 11,
  },
  deleteBtn: {
    padding: 12,
    justifyContent: "center",
  },
  vibePillText: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});

export default ListCard;
