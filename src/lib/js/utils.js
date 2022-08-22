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

  // Decode URI octets
  if (urlObject.pathname) {
    urlObject.pathname = decodeURI(urlObject.pathname);
  }

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

  // Take advantage of many of the Node `url` normalizations
  string = urlObject.toString();

  // Remove trailing slash if found
  if (string.endsWith("/")) {
    string = string.replace(/\/+$/, "");
  }

  return string;
}

const fedexPattern = new RegExp(
  /(\b96\d{20}\b)|(\b\d{15}\b)|(\b\d{12}\b)|(\b((98\d\d\d\d\d?\d\d\d\d|98\d\d) ?\d\d\d\d ?\d\d\d\d( ?\d\d\d)?)\b)|(^[0-9]{15}$)/,
);
const upsPattern = new RegExp(
  /\b(1Z ?[0-9A-Z]{3} ?[0-9A-Z]{3} ?[0-9A-Z]{2} ?[0-9A-Z]{4} ?[0-9A-Z]{3} ?[0-9A-Z]|[\dT]\d\d\d ?\d\d\d\d ?\d\d\d)\b/i,
);
const uspsPattern = new RegExp(
  /((\b\d{30}\b)|(\b91\d+\b)|(\b\d{20}\b))|(^E\D{1}\d{9}\D{2}$|^9\d{15,21}$)|(^91[0-9]+$)|(^[A-Za-z]{2}[0-9]+US$)/,
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
