Hack for Western Mass process for working on this site.
----
* Pick an issue from the queue
* Make a branch and name it after the issue number, example: 12345-fix-css
* Do your work in that branch (see note at bottom of this for how to compile SASS if you are doing CSS work)
* Push that branch: `git push origin 12345-fix-css`
* Optional: you can link a commit to an issue by adding #issuenumber, example `git push origin 12345-fix-css #12345`
* File a pull request through the Github UI

Deploying to Pantheon (Rick Hood does this for now)
----
* Pick a pull request
* Reveiw it however you like.
* When all OK, merge the pull request on Github.
* Do `git checkout master`
* On local, `git fetch github`
* Then `git merge github/master`
* Then push to Pantheon: `git push origin master`
(Note Rick has two remotes: in his case "origin" is Pantheon and "github" is Github.  In your case "origin" = Github.  Possible to do: Rick change his local git to rename "origin" to "pantheon" and "github" to "origin".)

Local Setup Using Lando for Local Dev Stack
----
* Get lando: https://docs.lndo.io
* Clone the repo into a folder where you want the local site to be:
  * `git clone https://github.com/hackforwesternmass/lightupthemap.git foldername`
* cd into that folder:
  * `cd foldername`
* Start the app:
  * `lando start`
  * It installs a bunch of stuff when when it finishes it looks like this:
  
  `BOOMSHAKALAKA!!!`
  
  `Your app has started up correctly.`
  `Here are some vitals:`
  
   `NAME      lightupthemap`
   `LOCATION  /Users/username/path_to_folder`
   `SERVICES  appserver, nginx, database, cache, edge_ssl, edge, index, node-cli`
   `URLS      https://localhost:32771`
             `http://localhost:32772`
             `https://localhost:32775`
             `http://localhost:32774`
             `http://lightupthemap.lndo.site`
             `https://lightupthemap.lndo.site`

* Import the DB
  * Get the DB from H4WM Google Drive
  * Import with lando: `lando db-import name_of_db_file.sql.gz`
* To get logged in as admin
  * `lando drush uli` ~ spit out a login URL for the admin user
  * the link looks like this: http://default/user/reset/1/1503870598/m_FqhS9_UO14BqQShEGXpe0rKsTFVGj2ox5PAndkffw/login
  * take the part starting with /user/reset/...  and tack that onto the url for your local site
  * like this https://lightupthemap.lndo.site/user/reset/1/1503870598/m_FqhS9_UO14BqQShEGXpe0rKsTFVGj2ox5PAndkffw/login
  * that will get you to a page to reset the user/1 password

Lando will install npm, gulp, composer and allows you to use those tools.
* To watch the theme sass files:
  * `lando gulp watch`
* To get usefule info about your app like connecting the DB container use:
  * `lando info`
  
Local setup using your own local stack (MAMP or whatever)
----
* Clone the repo to wherever you keep your local sites
* cd into that folder and run `npm install`
* Create a database and import the database dump (ask Rick Hood if you do not know where that is)
* You copy /sites/example.settings.local.php to /sites/default/settings.local.php
* Put your local database setting in settings.local.php like this (put it at the bottom of the file):

`$settings['install_profile'] = 'standard'; `
`$databases['default']['default'] = array ( ` 
` 'database' => 'light_up',`
` 'username' => 'root', `
` 'password' => 'password', `
` 'prefix' => '', `
` 'host' => 'localhost', `
` 'port' => '3306', `
` 'namespace' => 'Drupal\\Core\\Database\\Driver\\mysql', `
` 'driver' => 'mysql', `
` ); `
 
 Change database, username and password appropriately for your local.
 
* Do not mess with sites/default/settings.php as that will break the site on Pantheon.  That file has code that says "if there is a settings.local.php file, use the database settings in there".  
* This is one resource: https://www.drupal.org/docs/develop/local-server-setup

Notes on theme used (needed for css work)
----
* The theme uses SASS.  SCSS files are located in /themes/custom/lightup/sass
* Compile SASS by runnning `gulp watch` in the root of the site.

Above should be all you need, below is more info.
 
* This site uses a subtheme of the COG theme: https://www.drupal.org/project/cog
* Documentation for this theme: https://github.com/acquia-pso/cog/blob/8.x-1.x/STARTERKIT/README.md
* The theme is in themes/custom/lightup  compiling sass is done in there via gulp watch.
* You need certain things installed for gulp to work, but `lando install` does that (above) or runnign npm install in root does that if you do not do the lando install.
