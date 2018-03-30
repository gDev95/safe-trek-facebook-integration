# SafeTrek App with Facebook Integration

The React Native App is developed targeting Android and not yet fully hybrid. Therefor, it can only run on Android. 

## In order to run  the app
### Clone and install dependencies:
` git clone https://github.com/gDev95/safe-trek-facebook-integration.git` 
` cd ./safe-trek-facebook-integration`
` yarn`

### Transpiling Typescript code into Javascript
` npm run build`
Possible occuring errors: `TS2300: Duplicate identifier 'require'`
This is a conflict of `@types/react-native` and `@types/node` in `node_modules`
Open the `index.d.ts` suggested by the error message and comment out the line indicated by the error
(working on a better solution)

### Building the app (Please make sure that either an emulator is running or a physical android device)
` npm run build-android`
