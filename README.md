# BRAIN-app
Application to support mental health, started from the Ignite boilerplate.

3. Install dependencies:
   `yarn`
   `cd ios && pod deintegrate && pod install && cd ..`
   `cd android && ./gradlew clean && cd ..      `

4. Run the project:
`yarn android` # For Android
`yarn ios` # For iOS

after simulator launch run `yarn start`

if device simulator didn't find `adb reverse tcp:8081 tcp:8081` \*`./gradlew build release -x lint`

5. Generate the Signed APK or AAB
   Run the following command in your project root:

For Signed APK:
`cd android && ./gradlew assembleRelease`
The APK will be generated at:
`android/app/build/outputs/apk/release/app-release.apk`

For Signed App Bundle (AAB):
`cd android && ./gradlew bundleRelease`
android/app/build/outputs/bundle/release/app-release.aab