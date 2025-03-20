public with sharing class ImageController {

    @AuraEnabled
    public static String uploadImage(String base64Data, String fileName) {
        if (String.isEmpty(base64Data) || String.isEmpty(fileName)) {
            throw new AuraHandledException('File data and file name are required.');
        }

        ContentVersion contentVersion = new ContentVersion();
        contentVersion.Title = fileName;
        contentVersion.PathOnClient = fileName;
        contentVersion.VersionData = EncodingUtil.base64Decode(base64Data);
        insert contentVersion;
        ContentVersion insertedVersion = [
            SELECT ContentDocumentId FROM ContentVersion WHERE Id = :contentVersion.Id
        ];
        ContentDocumentLink contentDocumentLink = new ContentDocumentLink();
        contentDocumentLink.ContentDocumentId = insertedVersion.ContentDocumentId;
        contentDocumentLink.LinkedEntityId = UserInfo.getUserId(); 
        contentDocumentLink.ShareType = 'I'; 
        contentDocumentLink.Visibility = 'AllUsers'; 
        insert contentDocumentLink;

        return insertedVersion.ContentDocumentId;
    }

    @AuraEnabled(cacheable=true)
    public static List<ContentVersion> getUserImages() {
        List<ContentDocumentLink> documentLinks = [
            SELECT ContentDocumentId
            FROM ContentDocumentLink
            WHERE LinkedEntityId = :UserInfo.getUserId()
        ];
        Set<Id> contentDocumentIds = new Set<Id>();
        for (ContentDocumentLink link : documentLinks) {
            contentDocumentIds.add(link.ContentDocumentId);
        }
        if (contentDocumentIds.isEmpty()) {
            return new List<ContentVersion>();
        }
        return [
            SELECT Id, Title, ContentDocumentId, FileExtension
            FROM ContentVersion
            WHERE ContentDocumentId IN :contentDocumentIds
        ];
    }

    @AuraEnabled
    public static void deleteImage(String contentDocumentId) {
        if (String.isEmpty(contentDocumentId)) {
            throw new AuraHandledException('ContentDocumentId is required.');
        }
        ContentDocument contentDocument = [
            SELECT Id FROM ContentDocument WHERE Id = :contentDocumentId
        ];
        delete contentDocument;
    }
}