Skylight is a tool to help manage, streamline, and support the Firefox Messaging System (FxMS) [[1][1],[2][2]].

A bunch of the code, ideas, and links come from the OMC team's work week Hackathon and follow-on thinking/mockups; thanks to everyone who contributed!

## Setting local environment variables

1. Copy the sample env file

   `cp .env.sample .env.local`

1. Modify variables in .env.local
   1. The `EXPERIMENTER_API_PREFIX` environment variable is the base URL for the experimenter API and it defaults to the production instance. Paramaters like `status` and `application` are added to this base URL in the code to specify live/completed status and different platforms (ie. fenix, ios. firefox-desktop).

## Running the development server

```bash
npm run dev
```

## License

Limelight is released under the terms of the [Mozilla Public License 2.0](LICENSE).

## Code of Conduct

This repository follows a [code of conduct](CODE_OF_CONDUCT.md).

[1]: https://experimenter.info/messaging/experiments-and-user-messaging
[2]: https://firefox-source-docs.mozilla.org/browser/components/newtab/content-src/asrouter/docs/index.html
