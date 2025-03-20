public class Voltas_Dashboard {
    @AuraEnabled(cacheable=true)
    public static Integer TotalOpenSRToday(){
        AggregateResult[] results = [
            SELECT COUNT(Id) totalCount
            FROM Case
            WHERE CreatedDate = TODAY AND Status = 'Open'
        ];

        if (results.size() > 0) {
            system.debug((Integer)results[0].get('totalCount'));
            return (Integer)results[0].get('totalCount');
        } else {
            return 0;
        }
        
        /*Datetime dt= system.now().addDays(-500);
        System.debug('datetime'+dt);
        List<AggregateResult> a=[Select Count(Id) cnt from Case where CreatedDate>:dt];
        List<Case> c=[Select Id, CreatedDate from Case where CreatedDate>:dt];       
      	System.debug('A'+a);
        String str = String.valueof(a[0].get('cnt'));
        Integer b= Integer.valueof(str);
        System.debug('B'+b);
        System.debug('C:'+c);
     
        return b;*/
        
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Integer> TotalPendingSR() {
        Datetime dt = System.now().addDays(-1);
        
        List<AggregateResult> recentCases = [
            SELECT Count(Id) cnt 
            FROM Case 
            WHERE Status = 'Pending' 
            AND CreatedDate >= :dt
        ];
        
        List<AggregateResult> olderCases = [
            SELECT Count(Id) cnt 
            FROM Case 
            WHERE Status = 'Pending' 
            AND CreatedDate < :dt
        ];
        
        Integer recentCount = (Integer) recentCases[0].get('cnt');
        Integer olderCount = (Integer) olderCases[0].get('cnt');
        
        System.debug('Recent Count: ' + recentCount);
        System.debug('Older Count: ' + olderCount);
        
        return new List<Integer>{recentCount, olderCount};
    }

    @AuraEnabled(cacheable=true)
    public static Integer TotalClosedin24(){
        Datetime dt= system.now();
        System.debug('datetime'+dt);
        List<AggregateResult> a=[Select Count(Id) cntt from Case where Difference_Closed__c<=1];
         String str = String.valueof(a[0].get('cntt'));
        Integer b= Integer.valueof(str);
        //Integer b=a.Size();
        System.debug('B'+b);
        return b;  
    }
    
    @AuraEnabled(cacheable=true)
    public static Integer TotalClosedin48(){
        
       Datetime dt= system.now();
        System.debug('datetime'+dt);
        List<AggregateResult> a=[Select Count(Id) cntt from Case where Difference_Closed__c<=2];
         String str = String.valueof(a[0].get('cntt'));
        Integer b= Integer.valueof(str);
        //Integer b=a.Size();
        System.debug('B'+b);
        return b;  
    }

    @AuraEnabled(cacheable=true)
    public static Integer TotalClosedin72(){
        
       Datetime dt= system.now();
        System.debug('datetime'+dt);
        List<AggregateResult> a=[Select Count(Id) cnt from Case where Difference_Closed__c<=3];
         String str = String.valueof(a[0].get('cnt'));
        Integer b= Integer.valueof(str);
        //Integer b=a.Size();
        System.debug('B'+b);
        return b;  
    }


}