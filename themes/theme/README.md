# hugo-theme-refresh

Refresh is a simple, light, low-code theme designed for blogs running on [Hugo](https://gohugo.io).

## Installation

You'll need to have installed Hugo and created a new site before you can install the theme.

To install Hugo, [follow the official installation guide](https://gohugo.io/getting-started/quick-start/).

Refresh has only been tested on Hugo **v0.75.1**. The theme may fail to compile on lower versions.

### Create a new Hugo site

Use the following command to create a new Hugo site:

```bash
hugo new site mysite
```

### Install the Refresh theme

Navigate to your site's directory.

```bash
cd mysite
```

Use the following command to clone this repository into your Hugo `themes` directory:

```bash
git clone https://github.com/stuartmccoll/hugo-theme-refresh.git
```

### Run Hugo

After an initial install of the theme, generate your Hugo site using this command:

```bash
hugo
```

After this, you can use the following command for local development:

```bash
hugo server
```

Your site will be running locally at `localhost:1313`.

## Configuration

There are a number of configuration settings which should be copied from `example.config.toml` into your local `config.toml`.

The default values in the following should be replaced:

```toml
licenseType = "CC BY 4.0"
licenseLink = "https://creativecommons.org/licenses/by/4.0"
issuesLink = "https://github.com/stuartmccoll/hugo-theme-refresh/issues/new"
mastodonUsername = "@stuartmccoll@hachyderm.io"
```

## License

See [LICENSE](LICENSE).
