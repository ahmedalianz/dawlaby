import ConfirmModal, { ModalVariant } from "@/components/common/ConfirmModal";
import { Ionicons } from "@expo/vector-icons";
import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

// ── Types ──

export interface ConfirmOptions {
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  subtitle?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ModalVariant;
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

// ── Context ──

const ConfirmContext = createContext<ConfirmFn>(() => Promise.resolve(false));

// ── Provider ──

export const ConfirmProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);

  // Store resolve in a ref so it survives re-renders
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback<ConfirmFn>((opts) => {
    setOptions(opts);
    setVisible(true);

    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
    setOptions(null);
    // Only resolve as false if it hasn't been resolved as true yet
    if (resolveRef.current) {
      resolveRef.current(false);
      resolveRef.current = null;
    }
  }, []);

  const handleConfirm = useCallback(() => {
    if (resolveRef.current) {
      setVisible(false);
      resolveRef.current(true);
      resolveRef.current = null;
    }
  }, []);

  return (
    <>
      <ConfirmContext.Provider value={confirm}>
        {children}
      </ConfirmContext.Provider>

      {options && (
        <ConfirmModal
          visible={visible}
          onClose={handleClose}
          onConfirm={handleConfirm}
          icon={options.icon}
          title={options.title}
          subtitle={options.subtitle}
          confirmLabel={options.confirmLabel}
          cancelLabel={options.cancelLabel}
          variant={options.variant}
        />
      )}
    </>
  );
};

// ── Hook ──

export const useConfirm = (): ConfirmFn => useContext(ConfirmContext);
