import { ConfirmProvider, useConfirm } from "@/store/ConfirmContext";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { Button, Text, View } from "react-native";

// Mock the ConfirmModal to simplify interaction and ensure we are testing logic,
// not the modal's internal styling.
jest.mock("@/components/common/ConfirmModal", () => {
  const { Button, View, Text } = require("react-native");
  const MockConfirmModal = (props: any) => {
    if (!props.visible) return null;
    return (
      <View testID="modal-container">
        <Text>{props.title}</Text>
        <Text>{props.subtitle}</Text>
        <Button
          title="Confirm"
          testID="modal-confirm"
          onPress={props.onConfirm}
        />
        <Button title="Cancel" testID="modal-cancel" onPress={props.onClose} />
      </View>
    );
  };
  MockConfirmModal.displayName = "MockConfirmModal";
  return MockConfirmModal;
});

// A helper component to trigger the hook
const TestConsumer = () => {
  const confirm = useConfirm();
  const [result, setResult] = React.useState<string>("idle");

  const handlePress = async () => {
    const ok = await confirm({
      title: "Delete Item?",
      subtitle: "This cannot be undone",
    });
    setResult(ok ? "confirmed" : "cancelled");
  };

  return (
    <View>
      <Text testID="result-text">{result}</Text>
      <Button title="Open" testID="open-confirm" onPress={handlePress} />
    </View>
  );
};

describe("ConfirmContext & ConfirmProvider", () => {
  it("shows the modal with correct options when confirm is called", async () => {
    const { getByTestId, getByText } = render(
      <ConfirmProvider>
        <TestConsumer />
      </ConfirmProvider>,
    );

    fireEvent.press(getByTestId("open-confirm"));

    expect(getByTestId("modal-container")).toBeTruthy();
    expect(getByText("Delete Item?")).toBeTruthy();
    expect(getByText("This cannot be undone")).toBeTruthy();
  });

  it("resolves the promise as true when confirm is pressed", async () => {
    const { getByTestId } = render(
      <ConfirmProvider>
        <TestConsumer />
      </ConfirmProvider>,
    );

    fireEvent.press(getByTestId("open-confirm"));
    fireEvent.press(getByTestId("modal-confirm"));

    // We must wait for the promise to resolve and the state to update in TestConsumer
    await waitFor(() => {
      expect(getByTestId("result-text").props.children).toBe("confirmed");
    });
  });

  it("resolves the promise as false when cancel is pressed", async () => {
    const { getByTestId } = render(
      <ConfirmProvider>
        <TestConsumer />
      </ConfirmProvider>,
    );

    fireEvent.press(getByTestId("open-confirm"));
    fireEvent.press(getByTestId("modal-cancel"));

    await waitFor(() => {
      expect(getByTestId("result-text").props.children).toBe("cancelled");
    });
  });

  it("hides the modal after confirmation", async () => {
    const { getByTestId, queryByTestId } = render(
      <ConfirmProvider>
        <TestConsumer />
      </ConfirmProvider>,
    );

    fireEvent.press(getByTestId("open-confirm"));
    fireEvent.press(getByTestId("modal-confirm"));

    await waitFor(() => {
      expect(queryByTestId("modal-container")).toBeNull();
    });
  });

  it("cleans up the resolve ref after closing", async () => {
    const { getByTestId } = render(
      <ConfirmProvider>
        <TestConsumer />
      </ConfirmProvider>,
    );

    // First round
    fireEvent.press(getByTestId("open-confirm"));
    fireEvent.press(getByTestId("modal-confirm"));

    // Second round - ensure it still works (proving ref was cleaned and reset)
    fireEvent.press(getByTestId("open-confirm"));
    fireEvent.press(getByTestId("modal-cancel"));

    await waitFor(() => {
      expect(getByTestId("result-text").props.children).toBe("cancelled");
    });
  });
});
