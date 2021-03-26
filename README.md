# Implementation notes

These are notes describing implementation details including external libraries, dependencies, notes on running the app, 
and any requirements not completed

## How to run the app

This implementation uses React with Bootstrap, but uses only cdn references instead of any packaging and bundling to 
make it less obtrusive to run locally.  In order to run and test the app, I used live-server: https://www.npmjs.com/package/live-server

To install live-server:
```sh
npm install -g live-server
```

Then to start live-server:
```sh
live-server
```

A browser tab should open to the starting page of the app (index.html).  If your browser does not auto-launch,
open up Chrome and navigate to http://127.0.0.1:8080 (or whatever address and port live-server is running on).

Note: be sure to start the python server before launching live-server 

## Dependencies

You may need to install Node.js if live-server won't run.

To see if you have nodejs installed, open a terminal and enter:

```sh
node -v
```

I am running v14.4.0

Here are instructions for downloading/installing nodejs on macOS: https://nodejs.org/en/download/package-manager/#macos

## External libraries

-   React Bootstrap
-   React DatePicker: https://cdnjs.com/libraries/react-datepicker

## Missing implementation details

-   prod packaging for react, webpack, external libraries and modules, etc
-   linter, prettier
-   unit tests
-   browser forward/back handling
-   support for saving user's session
-   css styling and polish
-   feedback on form submit (i.e. busy/wait spinner gif)

## Changes to application_config_v1.json
-   added `label` property to all structs and fields to allow dynamic generation of UI labels
-   added `screens` property to structs to allow for ordering of form views
-   added optional `parent` property to structs to allow proper nesting when saving form data
