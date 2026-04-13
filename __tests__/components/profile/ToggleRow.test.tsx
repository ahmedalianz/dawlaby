import ToggleRow from "@/components/profile/ToggleRow";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

describe("ToggleRow", () => {
  it("triggers onToggle when the switch value changes", () => {
    const mockToggle = jest.fn();
    const { getByRole } = render(
      <ToggleRow
        label="Notifications"
        sublabel="Stay updated"
        icon="notifications"
        value={false}
        onToggle={mockToggle}
      />,
    );

    const toggle = getByRole("switch");
    fireEvent(toggle, "onValueChange", true);

    expect(mockToggle).toHaveBeenCalledWith(true);
  });
});
