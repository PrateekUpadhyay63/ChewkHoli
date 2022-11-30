import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoreTranslationService } from '@core/services/translation.service';
import { Observable } from 'rxjs';
import { UserManagementService } from '../../user-management/user-management.service';
import { GroupManagementService } from '../group-management.service';

// lanaguage 
import { locale as english } from './i18n/en';
import { locale as arabic } from './i18n/ar';
@Component({
  selector: 'app-view-group',
  templateUrl: './view-group.component.html',
  styleUrls: ['./view-group.component.scss']
})
export class ViewGroupComponent implements OnInit {
  public url = this.router.url;
  public urlLastValue;
  public selectedStatus;
  public selectedLanguage;
  public rows;
  public currentRow;
  public avatarImage: string;
  public groupData: any[] = [];
  public OrganizationName:any[] = [];
  public AllOrganizationName:any[] = [];
  public currentUserDetails;
  public status = [
    {id: 1, value: "Active"},
  ];
  public language = [
    {id: 1, value: "English"},
    {id: 2, value: "Arabic"},
  ];
    public selecteedAdmins = [];
    // Select Multi sub-admin Variable
    public multiSubAdminUsers:any[] =[];
    // public multiSubAdminUsers:Observable< any []>;
    public multiSubAdminSelected:any[] = [ ];
  
    // Select Multi End user Variable
    public multiEndUsers:any=[];
    // public multiEndUsers: Observable<any[]>;
    public multiEndbUsersSelected = [];
    
    // Select Multi Super user Variable
    public multiSuperUsers: Observable<any[]>;
    public multiSuperbUsersSelected = [];
    public items:any
    // public selectOrg

  constructor(
    private _coreTranslationService: CoreTranslationService,
    private groupManagementSvc: GroupManagementService,
    private userManagementSvc: UserManagementService,
    private router:Router,
  ) {
    this._coreTranslationService.translate(english, arabic);
    this.urlLastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
   }

  ngOnInit(): void {
    this.currentUserDetails = JSON.parse(localStorage.getItem("currentUser")); //to get current loged in user data
    this.groupManagementSvc.getGroupDetailsByID(this.urlLastValue).subscribe( (res:any) => {
      this.rows = res.data.groupDetails;
      this.currentRow = res.data.groupDetails;
      this.groupData = res.data.groupDetails.members;
      this.avatarImage = res.data.groupDetails.image;
      if(this.groupData.length > 0) {
        this.multiSubAdminSelected  =   this.groupData.filter((ele:any) => ele.organization_id == 1 && ele.role_id == 3); // select sub admins for current org. user
        this.multiEndbUsersSelected  =  this.groupData.filter((ele:any) => ele.organization_id == 1 && ele.role_id == 1); // select users for current org. user
        this.multiSuperbUsersSelected  =  this.groupData.filter((ele:any) => ele.organization_id == 1 && ele.role_id == 2); // select super users  for current org. user
      }
    },(err)=>{

    },()=>{
      this.groupManagementSvc.getOrgList().subscribe( (res:any) => {
        // console.log('calling this one')
        this.AllOrganizationName = res.data;
        this.groupData.forEach(element => {
          // console.log("element",)
           res.data.filter(ele => { 
        //      console.log("ele")
        //  if(element.id==3 && ele.id==3){
        //   console.log('match')
        //   console.log('ele',ele);
        //       console.log('elemement',element)
        //  }
           
            if(ele.id != 1 && ele.id === element.organization_id){
              console.log('ele',ele);
              console.log('elemement',element)
              this.OrganizationName.push({id:ele.id, name:ele.name, member:[element]});
              console.log("org", this.OrganizationName);
              
              const result = [];
              const map = new Map();
              for (const item of this.OrganizationName) {
                if (!map.has(item.id)) {
            map.set(item.id, true); // set any value to Map        
            result.push({id: item.id,name: item.name});
          }}
          // console.log("result", result);
          
          let array =[];
          result.forEach(org_id => {
            this.groupData.filter(org_id2 => {
              if(org_id.id == org_id2.organization_id){
                array.push({id:org_id.id, name:org_id.name, member:[org_id2]});
              }
            });
          });
          // console.log("array", array);
         
          
        const result1 = Array.from(new Set(array.map(s => s.id)))
            .map(lab => {         
            //  console.log("name", lab)
              return {
                id: lab,
                member: array.filter(s => s.id === lab).map(edition => {  
                  return edition.member[0]
                  })
              }
            })
        
        // console.log("result hdhwkdf", result1);
        
        let abc =  result1.map(item => {
          // debugger
            this.AllOrganizationName.forEach(item1 => {
              // debugger
              if(item.id == item1.id){
                // debugger
                item["name"] = item1.name;
                // return item;
              }
              // return item;
            });
            return item;
          })
          // console.log("abc", abc);
          
          this.OrganizationName = abc;
            // public
            // this.selectOrg  = [ { id: 3, name: "Civil Aviation" }, { id: 2, name: "Civil Defence" }, { id: 4, name: "Dubai Air Force" }]
          this.items =  this.OrganizationName;
          // console.log("org", this.OrganizationName);
        } 
        });
      });
    });
    });

  //   this.groupManagementSvc.getOrgList().subscribe( (res:any) => {
  //     console.log('calling this one')
  //     this.AllOrganizationName = res.data;
  //     this.groupData.forEach(element => {
  //       console.log("element",)
  //        res.data.filter(ele => { 
  //          console.log("ele")
  //      if(element.id==3 && ele.id==3){
  //       console.log('match')
  //       console.log('ele',ele);
  //           console.log('elemement',element)
  //      }
         
  //         if(ele.id != 1 && ele.id === element.organization_id){
  //           console.log('ele',ele);
  //           console.log('elemement',element)
  //           this.OrganizationName.push({id:ele.id, name:ele.name, member:[element]});
  //           console.log("org", this.OrganizationName);
            
  //           const result = [];
  //           const map = new Map();
  //           for (const item of this.OrganizationName) {
  //             if (!map.has(item.id)) {
  //         map.set(item.id, true); // set any value to Map        
  //         result.push({id: item.id,name: item.name});
  //       }}
  //       // console.log("result", result);
        
  //       let array =[];
  //       result.forEach(org_id => {
  //         this.groupData.filter(org_id2 => {
  //           if(org_id.id == org_id2.organization_id){
  //             array.push({id:org_id.id, name:org_id.name, member:[org_id2]});
  //           }
  //         });
  //       });
  //       // console.log("array", array);
       
        
  //     const result1 = Array.from(new Set(array.map(s => s.id)))
  //         .map(lab => {         
  //         //  console.log("name", lab)
  //           return {
  //             id: lab,
  //             member: array.filter(s => s.id === lab).map(edition => {  
  //               return edition.member[0]
  //               })
  //           }
  //         })
      
  //     // console.log("result hdhwkdf", result1);
      
  //     let abc =  result1.map(item => {
  //       // debugger
  //         this.AllOrganizationName.forEach(item1 => {
  //           // debugger
  //           if(item.id == item1.id){
  //             // debugger
  //             item["name"] = item1.name;
  //             // return item;
  //           }
  //           // return item;
  //         });
  //         return item;
  //       })
  //       // console.log("abc", abc);
        
  //       this.OrganizationName = abc;
  //         // public
  //         // this.selectOrg  = [ { id: 3, name: "Civil Aviation" }, { id: 2, name: "Civil Defence" }, { id: 4, name: "Dubai Air Force" }]
  //       this.items =  this.OrganizationName;
  //       // console.log("org", this.OrganizationName);
  //     } 
  //     });
  //   });
  // });

  
      this.selectedLanguage = this.language[0];
      this.selectedStatus = this.status[0];
  }
  // checkOrgName(){
  //   console.log('OrganizationName',this.OrganizationName)
  // }
  
  back() {
    this.router.navigateByUrl("/group-management/group-list");
  }

}
