# check-deps-dups

A simple NPM script to detect all the duplicate modules in your node modules.


## To Run

1. Add __check-deps-dups__ as part of your dev dependencies.

 ```sh
 npm i --save check-deps-dups

 ```
1. Add a stage in the scripts property in your package.json
  ```js
  "scripts": {
    "check-deps-dups": "node node_modules/check-deps-dups"
  },
  ```
1. Run the command
  ```sh
  npm run check-deps-dups
  ```

## Tips and Tricks

#### Only see $mypackagename

```
npm run check-deps-dups | grep '^$mypackagename' | sort
```

#### See everything but $mypackagename

```
npm run check-deps-dups | grep -v '^$mypackagename' | sort
```
