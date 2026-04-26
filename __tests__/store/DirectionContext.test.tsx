import { DirectionProvider, useDirection } from "@/store/DirectionContext";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const DirectionConsumer = () => {
  const { direction, isRTL, setDirection } = useDirection();
  return (
    <View>
      <Text testID="direction-text">{direction}</Text>
      <Text testID="rtl-status">{isRTL ? "RTL-ON" : "RTL-OFF"}</Text>
      <TouchableOpacity
        testID="toggle-rtl"
        onPress={() => setDirection("rtl")}
      />
      <TouchableOpacity
        testID="toggle-ltr"
        onPress={() => setDirection("ltr")}
      />
    </View>
  );
};

describe("DirectionContext", () => {
  it("provides the default direction as 'ltr'", () => {
    const { getByTestId } = render(
      <DirectionProvider>
        <DirectionConsumer />
      </DirectionProvider>,
    );

    expect(getByTestId("direction-text").props.children).toBe("ltr");
    expect(getByTestId("rtl-status").props.children).toBe("RTL-OFF");
  });

  it("updates the direction and reflects in the state", () => {
    const { getByTestId } = render(
      <DirectionProvider>
        <DirectionConsumer />
      </DirectionProvider>,
    );

    const rtlBtn = getByTestId("toggle-rtl");

    // Change to RTL
    fireEvent.press(rtlBtn);

    expect(getByTestId("direction-text").props.children).toBe("rtl");
    expect(getByTestId("rtl-status").props.children).toBe("RTL-ON");
  });

  it("correctly derives isRTL when toggling back and forth", () => {
    const { getByTestId } = render(
      <DirectionProvider>
        <DirectionConsumer />
      </DirectionProvider>,
    );

    // Switch to RTL
    fireEvent.press(getByTestId("toggle-rtl"));
    expect(getByTestId("rtl-status").props.children).toBe("RTL-ON");

    // Switch back to LTR
    fireEvent.press(getByTestId("toggle-ltr"));
    expect(getByTestId("direction-text").props.children).toBe("ltr");
    expect(getByTestId("rtl-status").props.children).toBe("RTL-OFF");
  });

  it("provides default values even without a provider (Context Fallback)", () => {
    // This tests the value passed to createContext() directly
    const { getByTestId } = render(<DirectionConsumer />);

    // Since the default in createContext is 'ltr'
    expect(getByTestId("direction-text").props.children).toBe("ltr");
    expect(getByTestId("rtl-status").props.children).toBe("RTL-OFF");
  });
});
