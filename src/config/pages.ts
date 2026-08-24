export type Page =
  | "video"
  | "videoDocument"
  | "selfie"
  | "reference"
  | "full"
  | "iad";

export const pages: Array<{ id: Page; label: string }> = [
  { id: "video", label: "Video recorder" },
  { id: "videoDocument", label: "Video document recorder" },
  { id: "selfie", label: "Selfie capture" },
  { id: "reference", label: "Reference capture" },
  { id: "full", label: "Full capture" },
  { id: "iad", label: "IAD video recorder" },
];
