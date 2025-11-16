import React from "react";
import { AUTH_PROVIDER } from "../config/appConfig";
import { useKeycloak } from "@react-keycloak/web";
import { firebaseLogin, firebaseLogout, getFirebaseAuth, firebaseLoginWithEmail } from "./firebaseClient";

type User = any;

export function useAuth() {
  if (AUTH_PROVIDER === "FIREBASE") {
    const [user, setUser] = React.useState<User | null>(null);
    const [initialized, setInitialized] = React.useState(false);

    React.useEffect(() => {
      const unsub = getFirebaseAuth().onAuthStateChanged((u: any) => {
        setUser(u);
        setInitialized(true);
      });
      return () => unsub();
    }, []);

    return {
      provider: "FIREBASE",
      user,
      login: firebaseLogin,
      loginWithEmail: firebaseLoginWithEmail,
      logout: firebaseLogout,
      initialized,
    };
  }

  // Default Keycloak
  const { keycloak, initialized } = useKeycloak();

  return {
    provider: "KEYCLOAK",
  user: keycloak?.tokenParsed ?? null,
  login: (opts?: any) => keycloak?.login(opts),
  logout: (opts?: any) => keycloak?.logout(opts),
    initialized,
  } as const;
}

export default useAuth;
