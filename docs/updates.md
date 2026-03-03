# Updates

Agile Management Portal includes a built-in auto-update mechanism that keeps the app current with the latest features and bug fixes.

## How Auto-Updates Work

When the application starts, it checks for available updates by contacting the update server. If a newer version is available:

1. The app downloads the update in the background.
2. You are notified that an update is ready to install.
3. The update is applied the next time you restart the app.

Updates are distributed through [GitHub Releases](https://github.com/eddywee/agile-management-portal/releases). Each release includes platform-specific installers for macOS and Windows.

## What Gets Updated

Updates include the complete application — both the frontend interface and the backend engine. Your local database is preserved across updates; no data is lost during the process.

## Release Notes

Each release includes notes describing what changed. You can review release notes on the [GitHub Releases page](https://github.com/eddywee/agile-management-portal/releases) before or after updating.

## Troubleshooting

If an update fails to apply:

1. Check your internet connection.
2. Restart the application to trigger a fresh update check.
3. If the issue persists, download the latest installer manually from the [releases page](https://github.com/eddywee/agile-management-portal/releases/latest) and reinstall.

Reinstalling from a fresh download preserves your database — the app stores data separately from the application files.
