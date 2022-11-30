import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { CoreTranslationService } from "@core/services/translation.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { GroupManagementService } from "../../group-management/group-management.service";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";
import { SystemServerManagementService } from "../system-server.service";
import { takeUntil } from "rxjs/operators";
import { locale as english } from "./i18n/en";
import { locale as arabic } from "./i18n/ar";
import { mediaType } from "./media-type-const";
import { dataFilter } from "./data-filter-modal";

const FileSaver = require("file-saver");

@Component({
  selector: "app-data",
  templateUrl: "./data.component.html",
  styleUrls: ["./data.component.scss"],
})
export class DataComponent implements OnInit {
  public searchValue = "";
  private _unsubscribeAll: Subject<any>;
  resorg: any;
  ressta: any;
  resRoles;
  pageIfx = 5;
  pageIfy = 0;
  page = {
    limit: 10,
    count: 0,
    offset: 1,
  };
  public rows;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public deleteGroupId: number;
  public groupName: string;
  public canEditGroup: boolean = true;
  public canAddGroup: boolean = true;
  public canDeleteGroup: boolean = true;
  public canViewGroup: boolean = true;
  public mediaType = mediaType;
  public groupData = [];
  public fakeArray;
  public current_page;
  public dataFilter: dataFilter;
  public selectedMediaType: string;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  constructor(
    private groupManagementSvc: GroupManagementService,
    private _coreTranslationService: CoreTranslationService,
    private _toastrService: ToastrService,
    private modalService: NgbModal,
    private SystemServerManagementService: SystemServerManagementService
  ) {
    this._unsubscribeAll = new Subject();
    this._coreTranslationService.translate(english, arabic);
  }
  ngOnInit(): void {
    this.pagination(1);
  }

  // modal Open Danger
  deleteModal(modalDanger, id: number, group_name: string) {
    this.deleteGroupId = id;
    this.groupName = group_name;
    this.modalService.open(modalDanger, {
      centered: true,
      windowClass: "modal modal-danger",
    });
  }

  // filter by media type of group
  filterByMedia(event) {
    if (event && event.value) {
      this.selectedMediaType = event.value;
      this.dataFilter = {
        pageNumber: "1",
        pageSize: "10",
        mediaType: this.selectedMediaType,
      };
      if (this.searchValue) this.dataFilter.search = this.searchValue;
      this.SystemServerManagementService.getGroupMediaListing(this.dataFilter);
    } else {
      this.selectedMediaType = null;
    }
  }

  // search group name
  onGroupSearch() {
    this.dataFilter = {
      pageNumber: "1",
      pageSize: "10",
      search: this.searchValue,
    };
    if (this.selectedMediaType)
      this.dataFilter.mediaType = this.selectedMediaType;
    this.SystemServerManagementService.getGroupMediaListing(this.dataFilter);
  }

  cancel() {
    this.modalService.dismissAll();
  }

  // Documents download
  downloadPdf(url) {
    const pdfUrl = url;
    const pdfName = "document";
    FileSaver.saveAs(pdfUrl, pdfName);
  }

  // Delete Attachment for Group.
  deleteAttachment() {
    this.SystemServerManagementService.deteleAttachment(
      this.deleteGroupId
    ).subscribe((response: any) => {
      if (response) {
        this._toastrService.success(response.message, "Success!", {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        });
        this.ngOnInit();
        this.modalService.dismissAll();
      }
    });
  }

  // Get attachments by group id
  getAllAttachments(id) {
    let params = null;
    if (this.selectedMediaType) params = this.selectedMediaType;
    this.SystemServerManagementService.getGroupAattachment(
      id,
      params
    ).subscribe((response: any) => {
      if (response?.data) {
        this.groupData = response.data.attachmentList;
      }
    });
  }

  // View media
  viewModal(modal, id) {
    this.getAllAttachments(id);
    this.modalService.open(modal, {
      centered: true,
      backdrop: false,
      size: "lg",
      windowClass: "modal modal-primary",
    });
  }

  pagination(page) {
    this.page.offset = page;
    this.getGroupListMedia();
  }

  pageNext() {
    if (this.page.count > 5 && this.page.count - this.current_page > 4) {
      this.pageIfy += 1;
      this.pageIfx += 1;
    }
    if (this.page.offset < this.page.count) {
      this.page.offset += 1;
      this.getGroupListMedia();
    }
  }

  pagePrev() {
    if (this.pageIfy > 0) {
      this.pageIfy -= 1;
      this.pageIfx -= 1;
    }

    if (this.page.offset > 1) {
      this.page.offset -= 1;
      this.getGroupListMedia();
    }
  }

  // Get Group listing with Media
  getGroupListMedia(search?) {
    let params: dataFilter = {
      pageNumber: this.page.offset.toString(),
      pageSize: this.page.limit.toString(),
    };
    if (this.searchValue) params.search = this.searchValue;
    if (this.selectedMediaType) params.mediaType = this.selectedMediaType;
    this.SystemServerManagementService.getGroupMediaListing(params);
    this.SystemServerManagementService.onGroupListingMediaChange.subscribe(
      (response) => {
        if (response.data) {
          this.current_page = response.current_page || 0;
          this.page.count = response.page_count || 0;
          this.fakeArray = new Array(response.page_count || 0);
          this.rows = response.data.attachmentList || [];
        }
      }
    );
  }

  onSearchClear() {
    this.searchValue = "";
    this.onFilterClear();
  }

  // on filter clear
  onFilterClear() {
    this.dataFilter = {
      pageNumber: "1",
      pageSize: "10",
      search: this.searchValue,
      mediaType: this.selectedMediaType,
    };
    this.SystemServerManagementService.getGroupMediaListing(this.dataFilter);
  }
}
