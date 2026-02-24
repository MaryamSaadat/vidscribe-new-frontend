import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthenticator } from "@aws-amplify/ui-react";

type Props = { children: React.ReactElement };

export default function RequireAuth({ children }: Props) {
  const { user } = useAuthenticator((ctx) => [ctx.user]);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
