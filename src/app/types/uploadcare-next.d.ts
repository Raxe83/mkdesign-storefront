// Type shim für @uploadcare/react-uploader/next (Subpath-Export)
// Notwendig weil tsconfig moduleResolution "node" keine package.json exports-map auflöst.
declare module "@uploadcare/react-uploader/next" {
  export * from "@uploadcare/react-uploader";
}
