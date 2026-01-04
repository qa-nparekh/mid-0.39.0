import { PlaygroundSDK } from "@sqaitech/playground";
import { useEffect, useState } from "react";
import { useEnvConfig } from "../store/store.mjs";
const useServerValid = function() {
    let shouldRun = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : true;
    const [serverValid, setServerValid] = useState(true);
    const { serviceMode } = useEnvConfig();
    useEffect(()=>{
        let interruptFlag = false;
        if (!shouldRun) return;
        Promise.resolve((async ()=>{
            while(!interruptFlag){
                const playgroundSDK = new PlaygroundSDK({
                    type: 'remote-execution'
                });
                const status = await playgroundSDK.checkStatus();
                status ? setServerValid(true) : setServerValid(false);
                await new Promise((resolve)=>setTimeout(resolve, 1000));
            }
        })());
        return ()=>{
            interruptFlag = true;
        };
    }, [
        serviceMode,
        shouldRun
    ]);
    return serverValid;
};
export { useServerValid };
