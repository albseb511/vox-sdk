import { VoxProvider, useAppContext, useToken } from "./context/VoxProvider";
import useListen from "./hooks/useListen";
import useSpeak from "./hooks/useSpeak";
var obj = {
    VoxProvider: VoxProvider,
    useListen: useListen,
    useAppContext: useAppContext,
    useToken: useToken,
    useSpeak: useSpeak
};
export default obj;
