//  handle localhost/ip/url with optional specified port
//  Ex: apple.com
//  Ex: 127.0.1.1/index.html
//  Ex: localhost:5000
//  Ex: local:1337 || dev:1337 => localhost: 1337
const ipPattern = new RegExp(
  /^(.*?:\/\/)?((dev|local|localhost)|((2(?!5?[6-9])|1|(?!0\d))\d\d?\.?\b){4})(:\d+)?(\/.*)?$/g,
);
const urlPattern = new RegExp(
  /^((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/.+)?)$/i,
);

export function isUrl(string) {
  if (ipPattern.test(string) || urlPattern.test(string)) {
    return true;
  } else {
    return false;
  }
}

export function normalizeUrl(string) {
  string = string.trim();
  string = string.includes("://") ? string : `http://${string}`;

  const urlObject = new URL(string);

  if (urlObject.hostname) {
    // Remove `www.`
    if (urlObject.hostname.startsWith("www.")) {
      urlObject.hostname = urlObject.hostname.replace(/^www\./, "");
    }

    // Redirect "dev" and "local" to "localhost"
    if (["dev", "local"].includes(urlObject.hostname)) {
      urlObject.hostname = urlObject.hostname.replace(
        /dev|local/gi,
        "localhost",
      );
    }
  }

  // Decode URI octets
  if (urlObject.pathname) {
    urlObject.pathname = decodeURI(urlObject.pathname);
  }

  // Take advantage of `url` normalizations
  string = urlObject.toString();

  // Remove trailing slash if found
  if (string.endsWith("/")) {
    string = string.replace(/\/+$/, "");
  }

  return string;
}

const fedexPattern = new RegExp(
  /^([0-9]{12}|100\d{31}|\d{15}|\d{18}|96\d{20}|96\d{32})$/,
);
const upsPattern = new RegExp(
  /^1Z[A-Z0-9]{16}$/,
);
const uspsPattern = new RegExp(
  /^([A-Z]{2}\d{9}[A-Z]{2}|(420\d{9}(9[2345])?)?\d{20}|(420\d{5})?(9[12345])?(\d{24}|\d{20})|82\d{8})$/,
);

export function isTracking(string) {
  if (
    fedexPattern.test(string) || upsPattern.test(string) ||
    uspsPattern.test(string)
  ) {
    return true;
  } else {
    return false;
  }
}

export function getTracking(string) {
  switch (true) {
    case fedexPattern.test(string):
      return "https://www.fedex.com/fedextrack/?trknbr=" + string;
      break;
    case upsPattern.test(string):
      return "https://wwwapps.ups.com/WebTracking/track?trackNums=" + string;
      break;
    case uspsPattern.test(string):
      return "https://tools.usps.com/go/TrackConfirmAction.action?tLabels=" +
        string;
      break;
    default:
      return false;
  }
}
