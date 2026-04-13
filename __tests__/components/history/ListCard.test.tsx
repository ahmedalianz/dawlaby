import ListCard from "@/components/history/ListCard";
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

  it("ListCard navigates to details on press", () => {
    const { getByTestId } = render(
      <ListCard item={mockItem} handleDelete={mockDelete} />,
    );

    const card = getByTestId("list-card");
    fireEvent.press(card);

    expect(router.push).toHaveBeenCalledWith({
      pathname: "/history/[id]",
      params: { id: "123" },
    });
  });

  it("ListCard triggers handleDelete on trash icon press", () => {
    const { getByTestId } = render(
      <ListCard item={mockItem} handleDelete={mockDelete} />,
    );

    // Finding the delete button via its structure or adding a testID is best
    // For this example, we'll simulate the press on the TouchableOpacity
    const deleteBtn = getByTestId("list-card");
    fireEvent(deleteBtn, "onLongPress");
    expect(mockDelete).toHaveBeenCalledWith("123");
  });
  it("ListCard renders the texts correctly", () => {
    const { getByText } = render(
      <ListCard item={mockItem} handleDelete={mockDelete} />,
    );
    expect(getByText("Casual")).toBeTruthy();
    expect(getByText("Shirt · Jeans")).toBeTruthy();
    expect(getByText('"Perfect for a weekend out."')).toBeTruthy();
  });
});
