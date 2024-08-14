import { Page } from "@playwright/test";

export class RuntimeDataPage {
  readonly page: Page;
  fxaOrigin: str;
  countryCode: str;
  private premiumAvailable: bool;
  private phoneAvailable: bool;
  private bundleAvailable: bool;
  private fxaEnv: str;

  constructor(page: Page) {
    this.page = page;
  }

  async open(): Promise<void> {
    const response = await this.page.request.get("/api/v1/runtime_data");
    const data = await response.json();
    this.fxaOrigin = data.FXA_ORIGIN;
    this.countryCode = data.PERIODICAL_PREMIUM_PLANS.country_code;
    this.premiumAvailable = data.PERIODICAL_PREMIUM_PLANS.available_in_country;
    this.phoneAvailable = data.PHONE_PLANS.available_in_country;
    this.bundleAvailable = data.BUNDLE_PLANS.available_in_country;
    if (this.fxaOrigin === "https://accounts.firefox.com/") {
      this.fxaEnv = "prod";
    } else if (this.fxaOrigin === "https://accounts.stage.mozaws.net/") {
      this.fxaEnv = "stage";
    } else {
      this.fxaEnv = "unknown";
    }
  }

  checkPlanAvailable(plan: str): [bool, str] {
    let available;
    if (plan === "premium") {
      available = this.premiumAvailable;
    } else if (plan == "phone") {
      available = this.phoneAvailable;
    } else if (plan == "bundle") {
      available = this.bundleAvailable;
    } else {
      throw new Error(`Unknown plan ${plan}.`);
    }

    if (!available) {
      return [
        false,
        `Can not subscribe to plan ${plan} in ${this.countryCode}`,
      ];
    }
    if (this.fxaEnv === "prod") {
      return [true, ""];
    }
    if (this.fxaEnv === "stage") {
      if (this.countryCode === "US" || this.countryCode === "CA") {
        return [true, ""];
      }
      return [
        false,
        `The plan ${plan} is not setup for ${this.countryCode} on FxA stage.`,
      ];
    }
    return [
      false,
      `It is unknown if plan ${plan} is available in ${this.countryCode} for FxA server ${this.fxaOrigin}`,
    ];
  }

  checkPremiumAvailable(): [bool, str] {
    return this.checkPlanAvailable("premium");
  }

  checkPhoneAvailable(): [bool, str] {
    return this.checkPlanAvailable("phone");
  }

  checkBundleAvailable(): [bool, str] {
    return this.checkPlanAvailable("bundle");
  }
}
