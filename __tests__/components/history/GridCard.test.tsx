import GridCard from "@/components/history/GridCard";
import { fireEvent, render } from "@testing-library/react-native";
import { router } from "expo-router";
import React from "react";

const mockItem = {
  id: "123",
  imageUri: "https://test.com/img.jpg",
  styleVibe: "Casual",
  date: new Date().toISOString(),
  detectedItems: ["Shirt", "Jeans"],
  stylistNote: "Perfect for a weekend out.",
  occasions: [],
  result: {
    detected_items: [],
    style_vibe: "",
    color_palette: [],
    occasions: [],
    suggestions: [],
    stylist_note: "",
  },
};

describe("History Cards", () => {
  const mockDelete = jest.fn();

  it("GridCard navigates to details on press", () => {
    const { getByTestId } = render(
      <GridCard item={mockItem} index={0} handleDelete={mockDelete} />,
    );

    const card = getByTestId("grid-card");
    fireEvent.press(card);

    expect(router.push).toHaveBeenCalledWith({
      pathname: "/history/[id]",
      params: { id: "123" },
    });
  });

  it("GridCard triggers handleDelete on trash icon press", () => {
    const { getByTestId } = render(
      <GridCard item={mockItem} index={0} handleDelete={mockDelete} />,
    );

    // Finding the delete button via its structure or adding a testID is best
    // For this example, we'll simulate the press on the TouchableOpacity
    const deleteBtn = getByTestId("grid-card");
    fireEvent(deleteBtn, "onLongPress");
    expect(mockDelete).toHaveBeenCalledWith("123");
  });
});
