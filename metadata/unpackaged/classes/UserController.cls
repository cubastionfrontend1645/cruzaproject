public with sharing class UserController {
    @AuraEnabled
    public static List<Map<String, Object>> getPaginatedUsers(Integer pageNumber, Integer pageSize) {
        List<Map<String, Object>> allUsers = new List<Map<String, Object>>();
        for (Integer i = 1; i <= 24; i++) {
            Map<String, Object> user = new Map<String, Object>();
            user.put('Id', i);
            user.put('Name', 'User ' + i);
            allUsers.add(user);
        }
        Integer startIndex = (pageNumber - 1) * pageSize;
        Integer endIndex = Math.min(startIndex + pageSize, allUsers.size());
        List<Map<String, Object>> paginatedUsers = new List<Map<String, Object>>();
        for (Integer i = startIndex; i < endIndex; i++) {
            paginatedUsers.add(allUsers[i]);
        }

        return paginatedUsers;
    }

    @AuraEnabled
    public static Integer getTotalUserCount() {
        return 24;
    }
}