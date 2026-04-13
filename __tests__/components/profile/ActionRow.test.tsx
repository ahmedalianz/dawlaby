import ActionRow from "@/components/profile/ActionRow";
import { Colors } from "@/constants/colors";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

describe("ActionRow", () => {
  const mockPress = jest.fn();

  it("calls onPress when pressed", () => {
    const { getByText } = render(
      <ActionRow
        label="Edit Profile"
        sublabel="Update your info"
        icon="person"
        onPress={mockPress}
      />,
    );

    fireEvent.press(getByText("Edit Profile"));
    expect(mockPress).toHaveBeenCalledTimes(1);
  });

  it("applies error colors when danger prop is true", () => {
    const { getByText } = render(
      <ActionRow
        label="Delete"
        sublabel="Action"
        icon="trash"
        onPress={mockPress}
        danger={true}
      />,
    );

    const label = getByText("Delete");
    // Flatten styles to verify the error color is applied
    const flattenedStyle = Object.assign({}, ...[label.props.style].flat());
    expect(flattenedStyle.color).toBe(Colors.errorAlpha90);
  });
});
