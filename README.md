Hack for Western Mass process for working on this site.
----
* Pick and issue from the queue
* Make a branch and name it after the issue number, example 12345-fix-css
* Do your work in that branch
* Push that branch: `git push origin 12345-fix-css`
* File a pull request through the Github UI

Deploying to Pantheon (Rick Hood does this for now)
----
* Pick a pull request
* Reveiwed it however you like.
* When all OK, merge the PR on Github.
* Do `git checkout master`
* On local, `git fetch github`
* Then `git merge github/master`
* Then push to Pantheon: `git push origin master`

Notes on theme used (needed for css work)
----
* This site uses a subtheme of the COG theme: https://www.drupal.org/project/cog
* Documentation for this theme: https://github.com/acquia-pso/cog/blob/8.x-1.x/STARTERKIT/README.md
* The theme is in themes/custom/lightup  compiling sass is done in there via gulp watch. 
* You need certain things installed for gulp to work, see the documentation above.

Other Notes
----
* Need instructions for how to set up site locally (settings.local.php)
* How to get developers the database needed?

