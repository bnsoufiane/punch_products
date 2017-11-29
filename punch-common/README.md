# Punch Common
Common assets and source for use across all Punch Products.

Install any folder within this module with bower.

# Installation instructions

1. Before installation, [https://bower.io/](bower) must be installed.
   `npm install -g bower`

2. Then, any component within this directory can be installed by adding its path to the installers bower.json file in the `dependencies` key.

   For example:

   ```
    {
      ...,
      "dependencies": {
        "punch-products-common-fonts": "../punch-common/assets/fonts/"
      }
    }
   ```



# Adding new folders to this repo

1. Make sure to run `bower init` after adding a new folder, this will make the package installable by bower.
