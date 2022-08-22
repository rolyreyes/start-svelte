console.log("dev:5173");
export default function normalizeUrl(string) {
  if (ipPattern.test(string) || urlPattern.test(string)) {
    string = string.trim();
    string = string.includes("://") ? string : `http://${string}`;

    const urlObject = new URL(string);

    // Decode URI octets
    if (urlObject.pathname) {
      urlObject.pathname = decodeURI(urlObject.pathname);
    }

    if (urlObject.hostname) {
      // Remove `www.`
      if (urlObject.hostname.startsWith("www.")) {
        urlObject.hostname = urlObject.hostname.replace(/^www\./, "");
      }

    //   if (["dev", "local"].includes(urlObject.hostname)) {
    //     urlObject.hostname = urlObject.hostname.replace(
    //       /dev|local/gi,
    //       "localhost",
    //     );
      }
    }

    // Take advantage of many of the Node `url` normalizations
    string = urlObject.toString();

    // Remove trailing slash if found
    if (string.endsWith("/")) {
      string = string.replace(/\/+$/, "");
    }

    return string;
  }
}
