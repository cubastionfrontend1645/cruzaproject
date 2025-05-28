public class RestCallout {
    @future(callout=true)
    public static void getAccount() {
        Http http = new Http();
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:Orgfarm/services/apexrest/accountManagement/');
        req.setMethod('GET');
        
        HttpResponse res = http.send(req);
        
        if (res.getStatusCode() == 200) {
            String responseBody = res.getBody();
            System.debug('Raw JSON: ' + responseBody);
List<Object> accountList = (List<Object>) JSON.deserializeUntyped(responseBody);

for (Object obj : accountList) {
    Map<String, Object> account = (Map<String, Object>) obj;
    System.debug('Id: ' + account.get('Id'));
    System.debug('Name: ' + account.get('Name'));

    Map<String, Object> attributes = (Map<String, Object>) account.get('attributes');
    System.debug('URL: ' + attributes.get('url'));
}
            /*// Deserialize JSON into a List of JsonParser objects
            List<JsonParser> accountList = (List<JsonParser>) JSON.deserialize(responseBody, List<JsonParser>.class);
            
            for (JsonParser acc : accountList) {
                System.debug('Account Name: ' + acc.Name);
                System.debug('Account Id: ' + acc.Id);
                System.debug('Account URL: ' + acc.attributes.url);
            }*/
            
        } else {
            System.debug('Failed with Code: ' + res.getStatusCode());
        }
    }
    
    @future(callout=true)
    public static void createAccountContact(String name,String industry, String rating, String lastname,String firstname) {
        Http http = new Http();
                Map<String, Object> account = new Map<String, Object>{
            'Name' => name,
            'Industry' => industry,
            'Rating' => rating
        };

        Map<String, Object> contact = new Map<String, Object>{
            'LastName' => lastName,
            'FirstName' => firstName
        };

        Map<String, Object> info = new Map<String, Object>{
            'account' => account,
            'contact' => contact
        };
        
            Map<String, Object> payload = new Map<String, Object>{
                'info'=> info
            };
            String reqBody = JSON.serialize(payload);
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:Orgfarm/services/apexrest/accountManagement/');
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json');
        req.setBody(reqBody);
        try {
            HttpResponse res = http.send(req);
            if (res.getStatusCode() == 200 || res.getStatusCode() == 201) {
                System.Debug('Returned status code as: ' + res.getStatusCode());
                System.Debug('Returned Body as: ' + res.getBody());
            } else {
                System.Debug('Returned status code as: ' + res.getStatusCode());
                System.Debug('Returned error: ' + res.getBody());
            }
        } catch (Exception e) {
            System.Debug('Callout Failed with error as: ' + e.getMessage());
        }
	}
	
    @future(callout=true)
    public static void updateAccountContact(String accId, String phone) {
        HttpRequest req = new HttpRequest();
        String endpoint = 'callout:Orgfarm/services/apexrest/accountManagement/?accid=' + accId;
 		req.setEndpoint(endpoint);
        req.setMethod('PUT');
        req.setHeader('Content-Type', 'application/json');
        Map<String, String> bodyMap = new Map<String, String>{
        'Phone' => phone
    };
    req.setBody(JSON.serialize(bodyMap));
        Http http = new Http();
        try {
            HttpResponse res = http.send(req);
            if (res.getStatusCode() >= 200 && res.getStatusCode() <= 299) {
                System.Debug('Callout Passed with code: ' + res.getStatusCode() + ' and body as: ' + 
                            res.getBody());
            } else {
                System.Debug('Callout return status: ' + res.getStatusCode() + ' and message as: ' + res.getBody());
            }
        } catch (Exception e) {
            System.Debug('Callout error as: ' + e.getMessage());
        }
    }
}