public class RestCallout {
    public static void getAccount() {
        Http http = new Http();
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:Orgfarm/services/apexrest/accountmanagement/');
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
}