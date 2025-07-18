trigger CaseTrigger on Case (before insert, before update, after insert, after update, after delete, after undelete) {
    if (Trigger.isBefore) {
            for (Case c : Trigger.New) {
        c.Origin = 'Web';
        c.Description = 'This case was ' + ((Trigger.isInsert) ? 'inserted' : 'updated') + ' on '
            + System.Today();
                if (Trigger.isUpdate) {
        Case oldc = Trigger.oldMap.get(c.Id);
                    if (oldc.Status != 'Closed' && c.Status == 'Closed' && String.isBlank(c.Resolution_Notes__c)) {
                        c.Resolution_Notes__c.addError('Please first add resolution notes. ');
                    }
                }
		
    }
    }
    if (Trigger.isAfter) {
        if (Trigger.isInsert) {
            List<Asset> assetList = new List<Asset>();
            for (Case c: Trigger.new) {
                Asset a = new Asset();
                a.Name = c.CaseNumber + ' Asset';
                a.Case__c = c.Id;
                a.ContactId = c.ContactId;
                a.Description = 'This is asset for case with id: ' + c.Id;
                assetList.add(a);
            }
            insert assetList;
        }
        if (Trigger.isUpdate) {
    List<Case> caseList = new List<Case>();
    for (Case c : Trigger.new) {
        // Only act if status changed to 'Closed'
        if (c.Status == 'Closed' && Trigger.oldMap.get(c.Id).Status != 'Closed') {
            Case nc = new Case();
            nc.ContactId = c.ContactId;
            nc.Status = 'New';
            nc.Origin = 'Web';
            nc.Description = 'This case was to notify closing of case number: ' + c.CaseNumber;
            // Add any required fields here, as needed
            caseList.add(nc);
        }
    }
    // Insert only if we have new cases to create
    if (!caseList.isEmpty()) {
        insert caseList;
    }}
    }
}