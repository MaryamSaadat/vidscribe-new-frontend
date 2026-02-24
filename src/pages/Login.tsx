import { Authenticator, defaultDarkModeOverride } from "@aws-amplify/ui-react";
import Logo from "../utils/Logo.png";

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
};

export default function Login() {
  return (
    <Authenticator components={components} theme={amplifyTheme}>
      {() => null}
    </Authenticator>
  );
}
