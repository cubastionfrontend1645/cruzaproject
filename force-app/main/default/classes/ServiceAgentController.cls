public with sharing class ServiceAgentController {
    @AuraEnabled(cacheable=true)
    public static List<Service_Agent_Master__c> getServiceAgents() {
        return [SELECT Id, Name FROM Service_Agent_Master__c ORDER BY Name];
    }

    @AuraEnabled(cacheable=true)
    public static Map<String, Integer> getCaseCountsByAgent(Id agentId) {
        Map<String, Integer> caseCounts = new Map<String, Integer>{
            'Open' => [SELECT COUNT() FROM Case WHERE Service_Agent_Master__c = :agentId AND Status = 'Open'],
            'Pending' => [SELECT COUNT() FROM Case WHERE Service_Agent_Master__c = :agentId AND Status = 'Pending']
        };
        System.debug(caseCounts);
        return caseCounts;
    }
}