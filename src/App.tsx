import { useState } from "react";

import { Nav } from "./components/Nav";
import { PageHeader } from "./components/PageHeader";
import type { Page } from "./config/pages";
import { pages } from "./config/pages";
import { VideoPage } from "./pages/VideoPage";
import { VideoDocumentRecorder } from "./pages/VideoDocumentRecorderPage";
import { SelfiePage } from "./pages/SelfiePage";
import { ReferencePage } from "./pages/ReferencePage";
import { FullCapturePage } from "./pages/FullCapturePage";
import { IadPage } from "./pages/IadPage";
import styles from "./App.module.css";

function App() {
  const [page, setPage] = useState<Page>("video");
  const title = pages.find((item) => item.id === page)?.label ?? "";

  return (
    <div className={styles.app}>
      <Nav page={page} onSelect={setPage} />

      <main className={styles.sdkZone}>
        <PageHeader title={title} />

        {page === "video" && <VideoPage />}
        {page === "videoDocument" && <VideoDocumentRecorder />}
        {page === "selfie" && <SelfiePage />}
        {page === "reference" && <ReferencePage />}
        {page === "full" && <FullCapturePage />}
        {page === "iad" && <IadPage />}
      </main>
    </div>
  );
}

export default App;
