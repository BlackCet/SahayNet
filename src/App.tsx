/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RouterProvider } from "react-router";
import { router } from "./router";
import { AuthProvider } from "./contexts/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
