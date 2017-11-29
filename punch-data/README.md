# Punch Data
Data application hub.


# Local development

This application is built and tested using node v4.4.3. The node v5.x.x is not supported.

1. Set the DEV_API_BASE in `/tools/config/project.config.ts`. By default it is set to 
`http://localhost:3000`. If you want to use the prod API, set it to `https://punch-staffing.appspot.com`

2. Run the following commands
    ```
    bower install # installed into src/common
    npm install # clean npm cache & delete node_modules folder if you get an error
    npm start
    ```

If you still have issues, try
    ```
    tsc --project tsconfig.json
    npm start
    ```

If a gulp.serve.dev error run this `npm run postinstall`

If you are getting `ENOSPC` error, run this command. This will increase quantity of watched files 
settings in Ubuntu.

`echo fs.inotify.max_user_watches=582222 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p`kk

#### In case of error about _missing modules_
Make sure that you don't have a `gulpfile.js` in the root directory for the module. We only need `gulpfile.ts`.
If you see any error for `npm run postinstall`, make sure that the `typings` version is `0.8.1` both globally and locally. Remove the typings folder and make sure that in `tsconfig.json` the node `exclude` looks like this:
```
    "exclude": [
        "node_modules",
        "dist",
        "typings/browser.d.ts",
        "typings/browser",
        "src"
    ],
```
Run npm install again followed by npm start. This ought to solve the refactoring issues.

# Developers guidelines

1. Make sure to run `gulp serve.prod` before committing changes to git. This task serves the application from 
prod directory which is most important directory as it is the one which is being deployed to live server.

2. Make sure there are not linting errors when you run `gulp serve.prod`

3. (This point is just info to help understand prod build) The prod build is using the [gulp-inline-ng2-template](https://github.com/ludohenin/gulp-inline-ng2-template)
to insert the component html and css files into component ts/js. This enables to produce 
high speed performance on live servers. For example in `admin/components/app/candidate-list.component.ts` we have
    ```
      templateUrl: './candidate-list.component.html',
      styleUrls: ['../../common/stylesheets/pages/candidate-list.css'],
    ```
    So when running the prod build, this plugin will read these files and will inject them into ts/js. If css file is going to have any error, it will not work in prod build, altough it may work in dev build.

4. When adding new js library to system, make sure to add its reference in map of system config. E.g when adding
    lodash, which is installed using `npm install lodash --save-dev`, add its reference in `tools/config/project.config.ts`
    ```
        _.extend(this.SYSTEM_BUILDER_CONFIG, {
          map: {
          ...
          'YOU_CAN_NAME_ANY': 'lodash', //added lodash
          ...
          }
    ```
      The lodash in quotes is representing the name of folder in `node_modules`. In our application now we can 
      import lodash using this (or any other import format)
      ```
      import * as _ from 'YOU_CAN_NAME_ANY'
      ```
      All js libraries referenced in map (and other custom js files) are merged together 
      and minified to a single `libs.js` file in prod build . This ensure to get max
      performace and speed on live server.

5. When adding new css library e.g `bootstrap` do this in `tools/config/project.config.ts`
    ```    
        let additional_deps: InjectableDependency[] = [
          ...
          {src: 'bootstrap/dist/css/bootstrap.css', inject: true}, //added bootstrap
          ...
        ]
    ```
    All css libraries defined here (and other custom css files) are merged together in prod build 
    and minified to a single `all.css` file. This ensure to get max performace and speed 
    on live server.

6. When adding new external font e.g fontawesome, add its directory in `tools/config/project.config.ts`
    ```
      EXTERNAL_FONTS_SRC   = [
        ...
        'node_modules/font-awesome/fonts/**', //added font directory
        ...
      ];
    ```
    All font paths defined in above array, are copied into `dist/dev/fonts` for dev build and into
    `dist/prod/fonts` for prod build. This enables us to reference them directly without having to
    look for `node_modules` directory. The `node_modules` directory is present only for 
    development, and not being pushed to live server.

7. If you want to add new gulp task, add it in the `tools/tasks/project` directory. There is sample task in 
that directory also. All tasks files in this directory are auto registered in application.


# Live deployment

For deployment, this repo needs to be built and injected into `staffing-api`. And the whole `staffing-api` 
gets uploaded to the server. Kindly follow these instructions to inject this repo in `staffing-api`.

1. Make sure everything is working locally.

2. Set the PROD_API_BASE in `/tools/config/project.config.ts`. By default it is set to 
`https://punch-staffing.appspot.com`

3. Make sure you have `staffing-api` repository in the same directory level as of this repo i.e both repos are 
siblings. If you have custom 
name and location for api repo, kindly set its path in `API_DIR` of `/tools/config/project.config.ts`. 
The default name of client directory in api is `public`. You can change it `API_CLIENT_DIR` in 
`/tools/config/project.config.ts`.

4. Run `gulp push.prod`

5. Deploy the application to google appengine using instructions provided at 
[`staffing-api`](https://github.com/punchagency/staffing-api)
