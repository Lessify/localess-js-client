<br/>
<br/>
<img src="https://github.com/Lessify/localess/wiki/img/logo-adaptive.svg" alt="logo">
<br/>
<br/>

----

# Localess JavaScript / TypeScript Client SDK

This client SDK is designed to work with the Localess API. It provides a simple way to interact with the Localess API from your JavaScript or TypeScript application.

> **Important:** 
> The Client is designed to be used on the server side only, as it requires your **Localess API Token** to be kept secret.
> Do not use this client in your frontend application, as it exposes your API Token to the public.

## Installation

### NPM
````bash
npm install @localess/js-client@latest
````

### Yarn
````bash
yarn add @localess/js-client@latest
````

## Usage

````ts
import {localessClient} from "@localess/js-client";

const llClient = localessClient({
  origin: 'https://my-localess.web.app', // A fully qualified domain name with protocol (http/https) and port.
  spaceId: 'I1LoVe2LocaLess4Rever', // Localess space ID, cna be found in the Localess Space settings
  token: 'Baz00KaT0KeN8S3CureLL' // Localess API token, can be found in the Localess Space settings
});

llClient.getLinks() // Fetch all Content Links
llClient.getContentBySlug('docs/overview') // Fetch content by SLUG
llClient.getContentById('FRnIT7CUABoRCdSVVGGs') // Fetch content by ID
llClient.getTranslations('en') // Fetch translations by locale
````
