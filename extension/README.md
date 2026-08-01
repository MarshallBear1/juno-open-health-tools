# Juno Appointment Prep browser extension

A small Chrome/Edge Manifest V3 extension for capturing short symptom observations and turning them into a plain-language appointment plan.

## What it does

- saves appointment date, clinician/service, and a main goal;
- separates notes into changes, timeline points, daily-life impacts, and questions;
- creates a portable plain-text appointment summary;
- copies or downloads the plan without sending it to a server;
- links to the free printable pack and the broader open-health-tools repository.

## Privacy and scope

The extension requests only the `storage` permission. Notes are stored in `chrome.storage.local` on the device where the extension is used. There are no analytics, remote APIs, advertising scripts, accounts, or background network requests in version 1.0.0. See [`PRIVACY.md`](PRIVACY.md).

The extension organises information. It does not diagnose, recommend treatment, replace a clinician, or provide emergency care.

## Install locally

1. Download and unzip the extension package.
2. Open `chrome://extensions` in Chrome or `edge://extensions` in Edge.
3. Enable **Developer mode**.
4. Choose **Load unpacked** and select the `extension` folder.
5. Pin **Juno Appointment Prep** to the browser toolbar.

## Build and test

From the repository root:

```bash
node scripts/build_extension_icons.mjs
node --test extension/test/*.test.mjs
./scripts/package_extension.sh
```

The store-ready ZIP is created in `output/extension/`.

## Store publication

[`store-listing.md`](store-listing.md) contains a policy-conscious Chrome Web Store listing draft. Publishing requires a Chrome Web Store developer account, its one-time registration fee, identity/merchant details where applicable, and acceptance of Google's developer terms. Those account actions are not part of the source package.

## License

MIT. See the repository [`LICENSE`](../LICENSE).
