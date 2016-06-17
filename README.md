# Sith

This README outlines the details of collaborating on this Ember application.
A short introduction of this app could easily go here.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (comes with `npm` - node package manager)

## Then use npm to install

* [Bower](https://bower.io/#install-bower) - From any directory run `npm install bower -g`
 * Make sure bower is installed, run `bower -v` and you should see a version number.
* [Ember CLI](http://www.ember-cli.com/) - From any directory run `npm install ember-cli -g`

## Then Install Application Dependencies

* `git clone <repository-url>` this repository
* change into the new directory
* run `npm install`
  * If you're a Windows user you may see an error regarding "ember windows". This app comes with an addon called `ember windows` that helps speed up the app build process.
  * Wait for the npm install to finish and then run `ember windows`.
     * If you see an error that states **Scripts cannot be executed on this system**, that means the ember addon is trying to run a powershell script. Read the next line in the command prompt (starts with "To fix...") to see how to fix this issue.
  * After running the ember windows command, re-run `npm install` and you should see no errors.
* run `bower install`

## Then Config Env Variables

There are a few environment settings stored outside of git that this project is dependent on. This is based on the [ember-cli-dotenv](https://www.npmjs.com/package/ember-cli-dotenv/) node package. See the `ember-cli-build.js` file to see how this is implemented.

* Create a file named `.env` and place it in the `/config` folder. It will sit in there next to the environment.js file.
* Add the following text to this file: `AUTH0_CLIENT_ID=<replaceWithClientId>`

## Running / Development

Run `ember s` or `ember serve` or `ember server`.
* Visit your app at [http://localhost:4200](http://localhost:4200).

This will run the app locally but will point towards the **dev** server for all the api calls. If you are running the api backend locally, use:
* run `ember s -e local` or `ember s -e localhost`

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Specify what it takes to deploy your app.

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](http://www.ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
