# ac-unsubscribr

This little pile of hacks makes up a chrome extension for office 365 outlook users who are tired of unwanted newsletter emails.

The extension scans your inbox for emails with an 'unsubscribe' link and makes it easy to unsubscribe without even opening the newsletter email or navigating to your inbox.

The code was put together as a hackathon submission at the 2015 angular connect conference in London.

# Complications

It turned out that the office application we registered to allow outlook api calls wouldn't accept redirecting back after authentication to a chrome extension url. It considered the url to be invalid. To work around this issue, we put together a small node.js server to handle the authentication flow itself inside an iframe. It delegates to a browser tab when authentication is required (the authentication process doesn't allow calls from an iframe).

The node server could be hosted in the cloud, so its presence in the solution isn't a complete deal breaker.

