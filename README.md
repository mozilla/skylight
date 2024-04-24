Skylight is a tool to help manage, streamline, and support the Firefox Messaging System (FxMS) [[1][1],[2][2]].

A bunch of the code, ideas, and links come from the OMC team's work week Hackathon and follow-on thinking/mockups; thanks to everyone who contributed!

## Running the development server

```bash
npm run dev
```
## Setting local environment variables

1. Copy the sample env file

    cp .env.sample .env.local

1. Modify variables in .env.local, e.g.

    EXPERIMENTER_API_KEY=someSecretAPIKey

To set the experiment recipe collection, uncomment the appropriate line in env.local.

## License

Limelight is released under the terms of the [Mozilla Public License 2.0](LICENSE).

## Code of Conduct

This repository follows a [code of conduct](CODE_OF_CONDUCT.md).

[1]: https://experimenter.info/messaging/experiments-and-user-messaging
[2]: https://firefox-source-docs.mozilla.org/browser/components/newtab/content-src/asrouter/docs/index.html
