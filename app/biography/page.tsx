import { Suspense } from "react";
import BiographyClient from "./BiographyClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BiographyClient />
    </Suspense>
  );
}