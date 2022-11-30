import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { TransferAuthorityService } from "../transfer-authority.service";
// lanaguage
import { locale as english } from "../i18n/en";
import { locale as arabic } from "../i18n/ar";
import { CoreTranslationService } from "@core/services/translation.service";

@Component({
  selector: "app-transfer-authority",
  templateUrl: "./transfer-authority.component.html",
  styleUrls: ["./transfer-authority.component.scss"],
})
export class TransferAuthorityComponent implements OnInit {
  public TransferAuthorityForm: FormGroup;
  public TransferAuthorityFormSubmitted = false;
  public subAdmin: any[] = [];
  public subAdminList2: any[] = [];
  public organizationName: any[] = [];
  public selectedOrganization: number;
  public selectRole = [
    { name: "IT Admin", id: 4 },
    { name: "Sub Admin", id: 3 },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private _toastrService: ToastrService,
    private _coreTranslationService: CoreTranslationService,
    private transferAuthoritySvc: TransferAuthorityService
  ) {
    this._coreTranslationService.translate(english, arabic);
  }

  ngOnInit(): void {
    // Reactive form initialization
    this.TransferAuthorityForm = this.formBuilder.group({
      orgnizationName: [null, [Validators.required]],
      transferfrom: [null, [Validators.required]],
      transferto: [null, [Validators.required]],
      role_id: [null, [Validators.required]],
    });

    // get org. list
    this.transferAuthoritySvc.getOrgList().subscribe((res: any) => {
      this.organizationName = res.data;
    });
  }
  // getter for easy access to form fields
  get TAFormControls() {
    return this.TransferAuthorityForm.controls;
  }

  // get sub admins for selected org.
  onOrgnizationSelect(eve) {
    this.TransferAuthorityForm.controls["transferfrom"].setValue(null);
    this.TransferAuthorityForm.controls["transferto"].setValue(null);
    this.selectedOrganization = eve;
  }

  onRoleSelect(eve) {
    // trasfer from list
    this.transferAuthoritySvc
      .getTransferFromList(this.selectedOrganization, eve)
      .subscribe((res: any) => {
        this.subAdmin = res.data;
      });

    // transfer to list
    this.transferAuthoritySvc
      .getTransferToList(this.selectedOrganization, eve)
      .subscribe((res: any) => {
        this.subAdminList2 = res.data;
      });
  }

  //remove slected sub admin for transfer to
  transferFromSubAdminSelected(eve) {
    // this.TransferAuthorityForm.controls['transferto'].setValue(null);
    // this.subAdminList2 = this.subAdmin.filter((element => element.id != eve));
  }

  // On Org. cleared below drop down will be null
  onOrganizationRemove() {
    this.TransferAuthorityForm.controls["transferfrom"].setValue(null);
    this.TransferAuthorityForm.controls["transferto"].setValue(null);
    this.TransferAuthorityForm.controls["role_id"].setValue(null);
    this.subAdminList2 = null;
    this.subAdmin = null;
  }

  // // On Sub Admin is removed Transfer To will be removed.
  // onFromSubAdminRemove() {
  //   this.TransferAuthorityForm.controls['transferto'].setValue(null);
  //   this.subAdminList2 = null;
  // }

  // Submit button
  transferAuthorityOnSubmit() {
    this.TransferAuthorityFormSubmitted = true;
    // stop here if form is invalid
    if (this.TransferAuthorityForm.invalid) {
      return;
    }
    let payload = {
      role_id: this.TransferAuthorityForm.value.role_id,
      from: this.TransferAuthorityForm.value.transferfrom,
      to: this.TransferAuthorityForm.value.transferto,
    };
    this.transferAuthoritySvc.transferAuthority(payload).subscribe(
      (res: any) => {
        this._toastrService.success(res.message, "Success", {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        });
        this.cancel();
        this.TransferAuthorityFormSubmitted = false;
      },
      (err) => {
        this._toastrService.error(err.error.message, "Error", {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        });
      }
    );
  }

  cancel() {
    this.TransferAuthorityForm.reset();
    this.TransferAuthorityFormSubmitted = false;
    this.subAdminList2 = null;
    this.subAdmin = null;
  }
}
