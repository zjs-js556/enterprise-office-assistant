// Patch expo-asset AssetUris.js to avoid assigning to read-only URL.protocol in Hermes
const fs = require("fs");
const path = require("path");

const assetUrisPath = path.join(
  __dirname,
  "..",
  "node_modules",
  "expo",
  "node_modules",
  "expo-asset",
  "build",
  "AssetUris.js"
);

if (!fs.existsSync(assetUrisPath)) {
  console.log("[patch-expo-asset] AssetUris.js not found, skipping");
  process.exit(0);
}

let content = fs.readFileSync(assetUrisPath, "utf8");

const oldGetManifestBaseUrl = `export function getManifestBaseUrl(manifestUrl) {
    const urlObject = new URL(manifestUrl);
    let nextProtocol = urlObject.protocol;
    // Change the scheme to http(s) if it is exp(s)
    if (nextProtocol === 'exp:') {
        nextProtocol = 'http:';
    }
    else if (nextProtocol === 'exps:') {
        nextProtocol = 'https:';
    }
    urlObject.protocol = nextProtocol;
    // Trim filename, query parameters, and fragment, if any
    const directory = urlObject.pathname.substring(0, urlObject.pathname.lastIndexOf('/') + 1);
    urlObject.pathname = directory;
    urlObject.search = '';
    urlObject.hash = '';
    // The URL spec doesn't allow for changing the protocol to \`http\` or \`https\`
    // without a port set so instead, we'll just swap the protocol manually.
    return urlObject.protocol !== nextProtocol
        ? urlObject.href.replace(urlObject.protocol, nextProtocol)
        : urlObject.href;
}`;

const newGetManifestBaseUrl = `export function getManifestBaseUrl(manifestUrl) {
    let href = manifestUrl;
    // Change the scheme to http(s) if it is exp(s)
    if (href.startsWith('exp:')) {
        href = href.replace('exp:', 'http:');
    }
    else if (href.startsWith('exps:')) {
        href = href.replace('exps:', 'https:');
    }
    const urlObject = new URL(href);
    // Trim filename, query parameters, and fragment, if any
    const pathname = urlObject.pathname;
    const trimmedPathname = pathname.substring(0, pathname.lastIndexOf('/') + 1);
    // Reconstruct the URL manually to avoid modifying URL properties (which are read-only in Hermes)
    const origin = urlObject.origin;
    return origin + trimmedPathname;
}`;

if (content.includes(oldGetManifestBaseUrl)) {
  content = content.replace(oldGetManifestBaseUrl, newGetManifestBaseUrl);
  fs.writeFileSync(assetUrisPath, content, "utf8");
  console.log("[patch-expo-asset] Successfully patched AssetUris.js for Hermes compatibility");
} else if (content.includes("href.startsWith('exp:')")) {
  console.log("[patch-expo-asset] Already patched, skipping");
} else {
  console.warn("[patch-expo-asset] WARNING: AssetUris.js content changed, manual review needed");
  process.exit(1);
}
