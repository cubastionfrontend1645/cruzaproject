public class FSLDataGenerator {
	public List<SelectOption> workTypeOptions {get;set;}
    public List<SelectOption> territoryOptions {get;set;}
    public List<SelectOption> workTypeUseOptions {get;set;}
    public List<SelectOption> priorityOptions {get;set;}
    public List<SelectOption> units {get;set;}
    public List<ServiceTerritory> territories;
    public List<WorkType> workTypes;
 
    public Integer numWosToCreate {get;set;}
    public Integer numWolisToCreate {get;set;}
    public Integer distance {get;set;}
    public String distanceUnit {get;set;}
    public String workTypeDecision {get;set;}
    public String priority {get;set;}
    public Boolean generateWolis {get;set;}
    public Boolean randomizeAddresses {get;set;}
    public Boolean randomWorkType {get;set;}
    public Boolean randomServiceTerritory {get;set;}
    public Boolean autoSchedule {get;set;}
    public Boolean submitted {get;set;}
    public Id workTypeChoice {get; set;}
    public Id territoryChoice {get; set;}
    public String customGanttLabel {get; set;}
    public string earlyStart {get; set;}
    public string dueDate {get; set;}
    
    public FSLDataGenerator()
    {   
        getWorkTypeOptions();
        getTerritoryOptions();
        getUnits();
        getWorkTypeUseOptions();
        getPriorityOptions();
        autoSchedule = false;
        submitted = false;
    }
    
    public void getWorkTypeOptions(){
        workTypeOptions = new list<SelectOption>();
        workTypes = new List<WorkType>([select id, name from worktype limit 100]);
        if(WorkTypes.size()>0){
            for(WorkType wt : workTypes){
                workTypeOptions.add(new selectOption(wt.Id, wt.Name));
            } 
        }
    }
    
    public void getTerritoryOptions(){
        territoryOptions = new list<SelectOption>();
        territories = new List<ServiceTerritory>([select id, name, address from serviceterritory where isactive = true limit 100]);
        if(territories.size()>0){
            for(ServiceTerritory st : territories){
                territoryOptions.add(new selectOption(st.Id, st.Name));
            } 
        }
    }
    
    public void getUnits(){
        distanceUnit = 'km';
        units = new list<SelectOption>();
        units.add(new selectOption('km', 'km'));
        units.add(new selectOption('mi', 'mi'));
    }
    
    public void getWorkTypeUseOptions(){
        workTypeDecision = 'wo';
        workTypeUseOptions = new list<SelectOption>();
        workTypeUseOptions.add(new selectOption('wo', 'Work Order'));
           workTypeUseOptions.add(new selectOption('woli', 'Work Order Line Item'));
        workTypeUseOptions.add(new selectOption('b', 'Both'));
    }
    
     public void getPriorityOptions(){
        priorityOptions = new list<SelectOption>();
        priorityOptions.add(new selectOption('None', 'None'));
        priorityOptions.add(new selectOption('Low', 'Low'));
           priorityOptions.add(new selectOption('Medium', 'Medium'));
        priorityOptions.add(new selectOption('High', 'High'));
        priorityOptions.add(new selectOption('Critical', 'Critical'));
        priorityOptions.add(new selectOption('Random', 'Random'));
    }
    
    public void generateData(){
        submitted = true;
        Double rand;
        Integer randIndex;
        List<WorkOrder> wos = new List<WorkOrder>();
        List<WorkOrderLineItem> wolisToCreate = new List<WorkOrderLineItem>();
        Map <Id, ServiceTerritory> territoriesMap = new Map <Id, ServiceTerritory>(territories);
        Map <Id, WorkType> workTypeMap = new Map<Id, WorkType>(workTypes);
        Decimal maxLat;
        Decimal minLat;
        Decimal minLon;
        Decimal lonPerUnit;
        Decimal randomLon;
        
        Decimal lon;
        Decimal radius;
        Decimal randomLat;
        Address jobAddress;
        Boolean priorityWasRandom = false;
        if(priority=='Random'){
            priorityWasRandom = true;
        }
        
        for(Integer x=0;x<numWosToCreate;x++){
            ServiceTerritory st;
            WorkOrder wo;
            if(randomServiceTerritory==true){
                rand = Math.random()*(territories.size()-1);
                randIndex = rand.intValue();
                st = territories.get(randIndex);
                territoryChoice = st.Id;
            }
            
            if(randomWorkType==true){
                rand = Math.random()*(workTypes.size()-1);
                randIndex = rand.intValue();
                workTypeChoice = workTypes.get(randIndex).Id;
            }
            
            if(workTypeDecision=='wo'||workTypeDecision=='b'){
                wo = new WorkOrder(Subject=workTypeMap.get(workTypeChoice).name+' Job', WorkTypeId=workTypeChoice, ServiceTerritoryId=territoryChoice);
            }
            else{
                wo = new WorkOrder(ServiceTerritoryId=territoryChoice);
            }
            
            if(priorityWasRandom){
                Double d = math.random() * 4;
                Integer index = d.intValue();
                if(index==0){
                    priority='Low';
                }
                else if(index==1){
                    priority='Medium';
                }
                else if(index==2){
                    priority='High';
                }
                else{
                    priority='Critical';
                }
            }
            if(priority<>'None'){
                wo.priority=priority;
            }
            
            wos.add(wo);
        }
        insert wos;
        
        if(generateWolis==true&&numWolisToCreate>0){
            WorkOrderLineItem woli;
            for(WorkOrder wo : wos){
                for(Integer x=0; x<numWolisToCreate; x++){
                    if(workTypeDecision=='b'){
                        woli = new WorkOrderLineItem(WorkOrderId=wo.Id, WorkTypeId=wo.WorkTypeId, Subject=workTypeMap.get(wo.WorkTypeId).name+' WOLI');
                    }
                    else if(workTypeDecision=='woli'){
                        woli = new WorkOrderLineItem(WorkOrderId=wo.Id, WorkTypeId=workTypeChoice, Subject=workTypeMap.get(workTypeChoice).name+' WOLI');
                    }
                    else{
                        woli = new WorkOrderLineItem(WorkOrderId = wo.Id);
                    }
                    if(priority<>'None'){
                        woli.Priority = priority;
                    }
                    
                    wolisToCreate.add(woli);
                }
            }
            insert wolisToCreate;
        }
        List<ServiceAppointment> sas = new List<ServiceAppointment>([select id, FSL__GanttLabel__c, longitude, latitude, serviceterritory.address, FSL__Auto_Schedule__c from serviceappointment where parentrecordid in:wolisToCreate or parentrecordid in:wos]);
        if(sas.size()>0){
            List<ServiceAppointment> sasToUpdate = new List<ServiceAppointment>();
            for(ServiceAppointment sa:sas){
                if(sa.serviceterritory.address<>null&&randomizeAddresses==true&&distance>0){
                    minLat=sa.serviceterritory.address.getLatitude();
                    minLon=sa.serviceterritory.address.getLongitude();
                    if(distanceUnit=='mi'){
                        randomLat = ((math.random()*distance/69)+minLat).setScale(6);
                        lonPerUnit = 1/(math.cos(minLat)*69);
                        radius = lonPerUnit*distance;
                        randomLon = ((math.random()*radius)+minLon).setScale(6);
                    }
                    else{
                        randomLat = ((math.random()*distance/111)+minLat).setScale(6);
                        lonPerUnit = 1/(math.cos(minLat)*111);
                        radius = lonPerUnit*distance;
                        randomLon = ((math.random()*radius)+minLon).setScale(6);
                    }
                    sa.Latitude=randomLat;
                    sa.Longitude=randomLon;
                }
                else if(sa.serviceterritory.address<>null&&(randomizeAddresses==false||distance==0||distance==null)){
                    sa.latitude=sa.serviceterritory.address.getLatitude();
                    sa.longitude=sa.serviceterritory.address.getLongitude();
                }
                if(autoSchedule){
                    sa.FSL__Auto_Schedule__c = true;
                }
                if(customGanttLabel<>null||customGanttLabel<>''){
                    sa.FSL__GanttLabel__c = customGanttLabel;
                }
                if(earlyStart<>''){
                    string dt = earlyStart+' 24:00:00';
                    sa.EarliestStartTime = datetime.valueOf(dt).AddDays(-1);
                }
                if(dueDate<>''){
                    string dt = dueDate+' 24:00:00';
                    sa.DueDate = datetime.valueOf(dt).AddDays(-1);
                }
                sasToUpdate.add(sa);
            }
            update sasToUpdate;
        }
    }
 
    public void reGenerateData(){
        List<ServiceTerritory> territories = null;
        List<WorkType> workTypes = null;
        
        numWosToCreate = null;
        numWolisToCreate = null;
        distance = null;
        distanceUnit = null;
        workTypeDecision = null;
        priority = null;
        generateWolis = null;
        randomizeAddresses = null;
        randomWorkType = null;
        randomServiceTerritory = null;
        workTypeChoice = null;
        territoryChoice = null;
        customGanttLabel = null;
        earlyStart = null;
        dueDate = null;
        
        getWorkTypeOptions();
        getTerritoryOptions();
        getUnits();
        getWorkTypeUseOptions();
        getPriorityOptions();
        autoSchedule = false;
        submitted = false;
    }
}