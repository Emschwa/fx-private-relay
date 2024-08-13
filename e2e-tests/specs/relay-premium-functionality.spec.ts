import test, { expect } from "../fixtures/basePages";

test.describe("Premium - General Functionalities, Desktop", () => {
  test.skip(() => {
    // Check that E2E_TEST_ACCOUNT_PREMIUM is set to an email
    const premium_email = process.env.E2E_TEST_ACCOUNT_PREMIUM || "";
    return premium_email.indexOf("@") === -1;
  }, "Set E2E_TEST_ACCOUNT_PREMIUM to the Mozilla account email of a premium user");

  test.skip(() => {
    // Check that E2E_TEST_ACCOUNT_PASSWORD is set
    const premium_password = process.env.E2E_TEST_ACCOUNT_PASSWORD || "";
    return premium_password.length === 0;
  }, "Set E2E_TEST_ACCOUNT_PASSWORD to the Mozilla account password of a premium user");

  test.beforeEach(async ({ landingPage, authPage, dashboardPage }) => {
    await landingPage.open();
    await landingPage.goToSignIn();
    await authPage.login(process.env.E2E_TEST_ACCOUNT_PREMIUM as string);
    const totalMasks = await dashboardPage.emailMasksUsedAmount.textContent();
    await dashboardPage.maybeDeleteMasks(true, parseInt(totalMasks as string));
  });

  test("Verify that a premium user can make more than 5 masks @health_check", async ({
    dashboardPage,
  }) => {
    await dashboardPage.generateMask(6, true);

    await expect
      .poll(
        async () => {
          return await dashboardPage.emailMasksUsedAmount.textContent();
        },
        {
          intervals: [1_000],
        },
      )
      .toContain("6");
  });

  test("Verify that a user can click the mask blocking options", async ({
    dashboardPage,
  }) => {
    await dashboardPage.generateMask(1, true);
    await dashboardPage.blockPromotions.click();
    expect(await dashboardPage.blockLevelPromosLabel.textContent()).toContain(
      "Blocking promo emails",
    );
    await dashboardPage.blockAll.click();
    expect(await dashboardPage.blockLevelAllLabel.textContent()).toContain(
      "Blocking all emails",
    );
  });

  test("Verify that a premium  user can generate a custom mask @health_check", async ({
    dashboardPage,
  }) => {
    // When there are zero masks, a random mask must be generated first
    await dashboardPage.generateMask();
    await dashboardPage.generatePremiumDomainMask();
  });
});
