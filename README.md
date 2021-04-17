# Microsoft Endpoint Manager - Group Assignment Analyzer

The Microsoft Endpoint Manager - Group Assignment Analyzer (short memgaa) is a web app which will give you an overview of all security groups that are currently used by the Endpoint Manager / Intune.

This comes in handy if you have to analyze the setup of intune for a new client.
The lack of documentation or a bad naming concept often lead to the questions "is this groups still used ... and if yes, where is it assigned?".

## App
memgaa is hosted on Azure as a static web app:
https://yellow-moss-05fef5803.azurestaticapps.net

Feel free to try out the app.
I'm happy for every feedback and pull requests.

## Consent and Permissions
To Authenticate with the Microsoft Graph API a multi tenant Azure AD application performs authentication and you will need to provide consent to the Azure AD application before you can use this tool.

## Tech
The webapp is built with react and chakra ui for the ui components.

### Libraries
https://reactflow.dev/

### Boilerplate Source
I didn't want to start from scratch so I copied this sample by Microsoft: https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/samples/msal-react-samples/react-router-sample
