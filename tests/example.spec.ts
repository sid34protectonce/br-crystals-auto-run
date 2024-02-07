import { test, Page } from '@playwright/test';

test('Traffic Generation for broken Crystals App', async ({ page }) => {
  const url: string = ' http://52.14.7.134:3000/';
  await generateTraffic(page, url);
});

function getRandomEmail(): string {
  var chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
  var string = '';
  for (var ii = 0; ii < 15; ii++) {
    string += chars[Math.floor(Math.random() * chars.length)];
  }
  return string + '@gmail.com';
}

function getRandomName(): string {
  var chars = 'abcdefghijklmnopqrstuvwxyz';
  var string = '';
  for (var ii = 0; ii < 10; ii++) {
    string += chars[Math.floor(Math.random() * chars.length)];
  }
  return string;
}

function getRandomNumber(): number {
  return Math.floor(Math.random() * 1000000);
}

async function generateTraffic(page: Page, url: string) {
  const email = getRandomEmail();
  const first_name = getRandomName();
  const last_name = getRandomName();
  const card_number = getRandomNumber();
  const ph_number = getRandomNumber();
  const password = "test123";

  console.log("Filling up registration form");
  await page.goto(url);
  await page.waitForTimeout(2000);
  await page.getByRole('link', { name: 'Sign in', exact: true }).click();
  await page.getByRole('link', { name: 'Sign Up Here' }).click();
  await page.getByPlaceholder('First name').fill(first_name);
  await page.getByPlaceholder('Last name').fill(last_name);
  await page.getByPlaceholder('Company').fill('po');
  await page.getByPlaceholder('Card number').fill(`${card_number}`);
  await page.getByPlaceholder('Phone number').fill(`${ph_number}`);
  await page.getByPlaceholder('Email').fill(email);
  await page.getByPlaceholder('Password').fill(password);
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'register' }).click();

  // login
  console.log("login in");
  await page.waitForTimeout(10000);
  await page.getByPlaceholder('Email').fill(email);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'sign in' }).click();

  // activity
  console.log("Doing some activity");
  await page.waitForLoadState();
  await page.getByRole('link', { name: 'Marketplace' }).click();
  await page.getByTitle('Amethyst').click();
  await page.goto(`${url}/marketplace`);

  // testimonial
  console.log("Writing testimonial");
  await page.getByRole('link', { name: 'Marketplace' }).click();
  await page.getByPlaceholder('Your Name').fill(first_name);
  await page.getByPlaceholder('Your Title').fill('po');
  await page.getByPlaceholder('Testimonial').fill('hello');
  await page.getByRole('button', { name: 'Send Testimonial' }).click();
  await page.reload();

  // message on home screen
  console.log("Writing message on home screen");
  await page.getByRole('link', { name: 'Home' }).click();
  await page.getByPlaceholder('Your Name').fill(first_name);
  await page.getByPlaceholder('Your Email').fill(email);
  await page.getByPlaceholder('Subject').fill('Hello');
  await page.getByPlaceholder('Message').fill('Hello world');
  await page.getByRole('button', { name: 'Send Message' }).click();
  await page.waitForLoadState();

  // edit user details
  console.log("Editing user details");
  await page.getByRole('link', { name: 'Edit user data' }).click();
  await page.waitForTimeout(3000);
  await page.getByPlaceholder(`${first_name}`).fill(`${first_name}h`);
  await page.getByRole('button', { name: 'Save changes' }).click();

  // various login activity
  console.log("Performing various login that are present in application");
  await page.getByRole('link', { name: `Log out ${first_name} ${last_name}` }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('link', { name: 'Sign in', exact: true }).click();

  const options = ['html', 'csrf', 'csrf_dom', 'oidc']
  for(const option of options) {
    console.log(`selecting option ${option} from combobox`);
    await page.getByRole('combobox').selectOption(option);
    await page.getByPlaceholder('Email').fill(email);
    await page.getByPlaceholder('Password').fill('test123');
    await page.getByRole('button', { name: 'sign in' }).click();
    await page.waitForTimeout(1000);
    await page.getByRole('link', { name: `Log out ${first_name} ${last_name}` }).click();
    await page.getByRole('link', { name: 'Sign in', exact: true }).click();
  }
}