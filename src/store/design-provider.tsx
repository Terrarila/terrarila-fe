"use client";
import { useEffect, useRef, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { persistStore, type Persistor } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { draftStorage, makeStore, type AppDispatch, type RootState } from "./store";

import type { BuilderCatalog } from "../lib/builder-catalog";
import { reconcileCatalog } from "./design-slice";

export const useDesignDispatch = useDispatch.withTypes<AppDispatch>();
export const useDesignSelector = useSelector.withTypes<RootState>();
export function DesignProvider({ children, catalog }: { children: React.ReactNode; catalog: BuilderCatalog }) {
  const [store] = useState(() => makeStore(draftStorage, catalog));
  const persistenceRef = useRef<Persistor | null>(null);
  const [persistor, setPersistor] = useState<Persistor | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  useEffect(() => {
    let active = true;
    const persistence = persistenceRef.current ?? persistStore(store);
    persistenceRef.current = persistence;
    void Promise.resolve().then(() => { if (active) setPersistor(persistence); });
    const flush = () => { void persistence.flush(); };
    const fail = () => setUnavailable(true);
    const visibility = () => { if (document.visibilityState === "hidden") flush(); };
    window.addEventListener("terrala-storage-unavailable", fail);
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      active = false;
      flush();
      window.removeEventListener("terrala-storage-unavailable", fail);
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [store]);
  useEffect(() => { if (catalog.ready) store.dispatch(reconcileCatalog(catalog)); }, [store, catalog]);
  const loading = <p role="status" style={{ padding: 32 }}>Đang khôi phục bản thiết kế của bạn…</p>;
  return <Provider store={store}>
    {unavailable ? <p role="status" style={{ padding: 16 }}>Trình duyệt chưa cho phép lưu bản thiết kế. Bạn vẫn có thể chọn và gửi yêu cầu; lựa chọn có thể mất khi đóng trang.</p> : null}
    {persistor ? <PersistGate persistor={persistor} loading={loading}>{children}</PersistGate> : loading}
  </Provider>;
}
