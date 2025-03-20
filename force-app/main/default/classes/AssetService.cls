public class AssetService {
    @AuraEnabled(cacheable=true)
    public static Boolean checkAssetBySerialNumber(String serialNumber) {
        List<Asset> assets = [SELECT Id FROM Asset WHERE SerialNumber = :serialNumber LIMIT 1];
        return !assets.isEmpty();
    }
}