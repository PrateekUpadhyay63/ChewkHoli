import { Component, OnInit } from "@angular/core";
import { SettingsService } from "./settings.service";
import { ToastrService } from "ngx-toastr";
import { locale as english } from "./i18n/en";
import { locale as arabic } from "./i18n/ar";
import { CoreTranslationService } from "@core/services/translation.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit {
  public SelectDayForm: FormGroup;
  day = [
    {
      title: "1 day",
      duration: "1",
    },
    {
      title: "3 days",
      duration: "3",
    },
    {
      title: "5 days",
      duration: "5",
    },
    {
      title: "7 days",
      duration: "7",
    },
    {
      title: "2 week",
      duration: "14",
    },
    {
      title: "3 week",
      duration: "21",
    },
    {
      title: "1 month",
      duration: "30",
    },
    {
      title: "3 month",
      duration: "90",
    },
    {
      title: "5 month",
      duration: "150",
    },
  ];
  data:any;

  constructor(
    private formBuilder: FormBuilder,
    private settingSvc: SettingsService,
    private _toastrService: ToastrService,
    private _coreTranslationService: CoreTranslationService
  ) {
    this._coreTranslationService.translate(english, arabic);
  }

  ngOnInit(): void {
    this.SelectDayForm=this.formBuilder.group(
      {
        selectedDay: [null, [Validators.required]]
      }
    )
  }

  filterByDays(event) {
    this.data=event;
    
  }

  submitSettings() {

    this.settingSvc.updateStreamDuration(this.data).subscribe((res: any) => {
      this._toastrService.success(res.message, "Success!", {
        toastClass: "toast ngx-toastr",
        closeButton: true,
        
      });
    });
    this.resetSettings();
  }

  resetSettings() {
    this.SelectDayForm.reset();
  }
}
