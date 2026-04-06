import React, { createContext, useContext, useState } from "react";

type Direction = "ltr" | "rtl";

const DirectionContext = createContext({
  direction: "ltr" as Direction,
  isRTL: false,
  setDirection: (dir: Direction) => {},
});

export const DirectionProvider = ({ children }: any) => {
  const [direction, setDirection] = useState<Direction>("ltr");

  return (
    <DirectionContext.Provider
      value={{
        direction,
        isRTL: direction === "rtl",
        setDirection,
      }}
    >
      {children}
    </DirectionContext.Provider>
  );
};

export const useDirection = () => useContext(DirectionContext);
