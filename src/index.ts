import { VoxProvider, useAppContext, useToken, AppContextType, VoxProviderConfig } from "./context/VoxProvider";
import useListen from "./hooks/useListen";
import useSpeak from "./hooks/useSpeak";

const obj = {
  VoxProvider,
  useListen,
  useAppContext,
  useToken,
  useSpeak,
};

export default obj;
