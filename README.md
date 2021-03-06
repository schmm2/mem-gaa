# Microsoft Endpoint Manager - Group Assignment Analyzer

The Microsoft Endpoint Manager - Group Assignment Analyzer (memgaa) is a web app which will give you an overview of all security groups that are currently beeing used by the Endpoint Manager / Intune.

This comes in handy if you have to analyze a tenant of a new client.
The lack of documentation or a bad naming concept often lead to the questions "is this groups still used ... and if yes, where is it assigned?".

![Overview](https://github.com/schmm2/mem-gaa/blob/01903b0bcc5077a74e87086fa3fe3f211f80b426/docs/img/memgaa.PNG)

## App
The app is hosted on Azure as a static web app and can be access via this [url](https://yellow-moss-05fef5803.azurestaticapps.net)

The integrated graph resources are:
- Device Enrollment Configuration
- Device Configurations
- Device Compliance Policies
- Windows Autopilot Deployment Profiles
- Android Managed App Protections
- iOS Managed App Protections
- Mobile App Configurations
- GroupPolicy Configurations
- Mobile Apps
- Powershell Scripts
- Proactive Remediations

### Roadmap
Currently not all policies and object types are supported. I'm working on adding these types in the near future:
- Endpoint Security Settings
- Conditional Access Policies

### Support
I'm happy for every feedback and pull request.
You can reach me via email in my bio. I will try to answer all questions as soon as possible.

### Consent and Permissions
To Authenticate with the Microsoft Graph API a multi tenant Azure AD application performs authentication and you will need to provide consent to the Azure AD application before you can use this tool.

## Tech
The webapp is built with react and chakra ui.

### Libraries
- https://reactjs.org/
- https://chakra-ui.com/
- https://reactflow.dev/

### Boilerplate Source
I didn't want to start from scratch so I copied this sample by [Microsoft](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/samples/msal-react-samples/react-router-sample)