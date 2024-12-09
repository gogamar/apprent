// import { Suspense } from "react";

import Calendar from "./Calendar";
// import Loading from "../loading";

export default function Availability() {
  return (
    <main>
      {/* <Suspense fallback={<Loading />}> */}
      <Calendar />
      {/* </Suspense> */}
    </main>
  );
}
