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
const fedexPattern = new RegExp(
  /(\b96\d{20}\b)|(\b\d{15}\b)|(\b\d{12}\b)|(\b((98\d\d\d\d\d?\d\d\d\d|98\d\d) ?\d\d\d\d ?\d\d\d\d( ?\d\d\d)?)\b)|(^[0-9]{15}$)/,
);
const upsPattern = new RegExp(
  /\b(1Z ?[0-9A-Z]{3} ?[0-9A-Z]{3} ?[0-9A-Z]{2} ?[0-9A-Z]{4} ?[0-9A-Z]{3} ?[0-9A-Z]|[\dT]\d\d\d ?\d\d\d\d ?\d\d\d)\b/i,
);
const uspsPattern = new RegExp(
  /((\b\d{30}\b)|(\b91\d+\b)|(\b\d{20}\b))|(^E\D{1}\d{9}\D{2}$|^9\d{15,21}$)|(^91[0-9]+$)|(^[A-Za-z]{2}[0-9]+US$)/,
);

export function isUrl(string) {
  if (ipPattern.test(string) || urlPattern.test(string)) {
    return true;
  } else {
    return false;
  }
}

export function normalizeUrl(string) {
  if (ipPattern.test(string) || urlPattern.test(string)) {
    if (
      string.startsWith("dev") ||
      string.startsWith("local") && !rawstring.includes(" ")
    ) {
      string = string.replace(
        /^(local|dev)(\/(.+)?|:\d+)?$/g,
        "localhost$2",
      );
    }

    string = string.startsWith("http") ? string : "http://" + string;
    return string;
  }
}

export function getUrl(string) {
  if (ipPattern.test(string) || urlPattern.test(string)) {
    if (
      string.startsWith("dev") ||
      string.startsWith("local") && !rawstring.includes(" ")
    ) {
      string = string.replace(
        /^(local|dev)(\/(.+)?|:\d+)?$/g,
        "localhost$2",
      );
    }

    string = string.startsWith("http") ? string : "http://" + string;
    return string;
  }
}

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