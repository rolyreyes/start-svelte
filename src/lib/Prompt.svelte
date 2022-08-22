<script>
  function identifyBrowser() {
    const isBrave = navigator.brave ? true : false;
    const testUserAgent = (regexp) => regexp.test(navigator.userAgent);
    switch (true) {
      case isBrave:
        return "brave";
      case testUserAgent(/edg/i):
        return "edge";
      case testUserAgent(/firefox|fxios/i):
        return "firefox";
      case testUserAgent(/chrome|chromium|crios/i):
        return "chrome";
      case testUserAgent(/safari/i):
        return "safari";
      default:
        return "browser";
    }
  }
  const browser = identifyBrowser();
</script>

<section>
  [
  <span style:color="var(--red)">root</span>
  in
  <span style:color="var(--cyan)">~/start</span>
  via
  <span style:color="var(--{browser})">
    {browser}
  </span>
  ]
  <br />
  <span style:color="var(--green)" style:font-weight="var(--light)">➜&nbsp;</span
  ><slot>command</slot>
</section>

 <style>
 section {
    padding-bottom: 1rem;
  }

  span {
    font-weight: var(--heavy);
  }
</style>
