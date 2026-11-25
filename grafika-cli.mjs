#!/usr/bin/env node
const usage = 'Usage: grafika [details|menu|reservation] [--language en|ka|ru|es]';
const [command = 'details', ...args] = process.argv.slice(2);

if (command === '--help' || command === '-h') {
  console.log(usage);
} else {
  try {
    if (!['details', 'menu', 'reservation'].includes(command) ||
        (args.length && (args.length !== 2 || args[0] !== '--language' ||
          !['en', 'ka', 'ru', 'es'].includes(args[1])))) {
      throw new Error(usage);
    }
    const url = new URL('https://www.grafikatbilisi.com/api/v1/restaurant');
    if (args.length) url.searchParams.set('menuLanguage', args[1]);
    const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error('Grafika API returned HTTP ' + response.status);
    const result = await response.json();
    console.log(command === 'details' ? JSON.stringify(result, null, 2) :
      result[command === 'menu' ? 'menuUrl' : 'reservationUrl']);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

