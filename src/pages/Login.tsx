import React, { useEffect, useMemo } from "react";
import {
  Authenticator,
  defaultDarkModeOverride,
  SelectField,
  useAuthenticator,
} from "@aws-amplify/ui-react";
import { fetchAuthSession } from "aws-amplify/auth";
import Cookies from "js-cookie";
import Logo from "../utils/Logo.png";
import { useLocation, useNavigate } from "react-router-dom";

const amplifyTheme = {
  name: "custom-theme",
  overrides: [
    defaultDarkModeOverride,
    {
      colorMode: "light",
      tokens: {
        colors: {
          brand: { primary: { value: "#6A1B9A" } },
          background: { primary: { value: "pink" } },
        },
      },
    },
  ],
};

const components = {
  Header() {
    return (
      <img
        alt="VidScribe Logo"
        src={Logo}
        style={{ width: 400, margin: "20px auto", display: "block" }}
      />
    );
  },

  SignUp: {
    FormFields() {
      const { validationErrors } = useAuthenticator();

      return (
        <>
          <Authenticator.SignUp.FormFields />

          <SelectField
            label="Vision status"
            name="custom:vision_status"
            descriptiveText="Helps us tailor accessibility settings."
            hasError={!!validationErrors["custom:vision_status"]}
            errorMessage={validationErrors["custom:vision_status"] as string}
            isRequired
          >
            <option value="">Select one</option>
            <option value="can_see">Sighted</option>
            <option value="partial">Blind</option>
            <option value="cannot_see">Low vision</option>
          </SelectField>
        </>
      );
    },
  },
};

function getSafeReturnTo(raw: unknown): string {
  const v = typeof raw === "string" ? raw : "";
  // avoid open-redirects; only allow internal paths
  if (!v.startsWith("/")) return "/";
  return v;
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, authStatus } = useAuthenticator((ctx) => [ctx.user, ctx.authStatus]);

  const returnTo = useMemo(() => {
    const fromState = (location.state as any)?.returnTo;
    const fromStorage = sessionStorage.getItem("returnTo");
    return getSafeReturnTo(fromState || fromStorage || "/");
  }, [location.state]);

  useEffect(() => {
    // Authenticator sets authStatus to "authenticated" when logged in
    if (authStatus !== "authenticated" || !user) return;

    (async () => {
      try {
        // Optional: capture tokens/user info for your API
        const session = await fetchAuthSession();

        // Store JWT if you use it elsewhere (your descriptionsApi reads Cookies.get("jwt"))
        const idToken = session?.tokens?.idToken?.toString();
        if (idToken) {
          Cookies.set("jwt", idToken);
        }

        // Store username for your API requirement (backend requires "username")
        // Use loginId if present, else fallback to user.username
        const username =
          (user as any)?.signInDetails?.loginId ||
          (user as any)?.username ||
          "anonymous";

        Cookies.set("username", username);
        localStorage.setItem("username", username);

      } catch (e) {
        // Even if this fails, we can still redirect
        console.warn("Post-login session/username setup failed:", e);
      } finally {
        // Redirect back and cleanup
        sessionStorage.removeItem("returnTo");
        navigate(returnTo, { replace: true });
      }
    })();
  }, [authStatus, user, navigate, returnTo]);

  return (
    <Authenticator
      components={components}
      theme={amplifyTheme}
      services={{
        async validateCustomSignUp(formData) {
          if (!formData["custom:vision_status"]) {
            return {
              "custom:vision_status": "Please select your vision status.",
            };
          }
        },
      }}
    >
      {() => null}
    </Authenticator>
  );
}