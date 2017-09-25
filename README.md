# addTags
add Priorities/Tags to PagerDuty incidents - priorities will be the tags

This application runs on node.js and can easily be deployed to Heroku. The intent of this app is to automatically populate 
priorities in a PagerDuty incident. For this example the priorities will be modified from the standard:
P1, P2, etc... to be 'Tag's representing entities for the instance.

In order to use this applicaiton you will need a PagerDuty V2 API Key - Configuration/API Key - from the PagerDuty menu.

Step 1. Have a PagerDuty contact enable 'Incident Priorities' feature if it is not turned on for your account.

Step 2. Modify the names of the Priorities within PagerDuty
- From PagerDuty menu select Configuration/Incident Priorites
- Modify the 'Priority Level' to match your tag. E.g. change 'P1' to 'DATA'
- Save the changes

Step 3. Pull the Priority IDs from your account using the following curl command:

curl -X GET --header 'Accept: application/vnd.pagerduty+json;version=2' --header 'Authorization: Token token=<API KEY>' 
'https://api.pagerduty.com/priorities'

Step 4. Modify the index.js file in this project to include the Priority IDs

