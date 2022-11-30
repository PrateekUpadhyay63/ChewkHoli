import { Component, OnInit } from "@angular/core";
import { locale as english } from "./i18n/en";
import { locale as arabic } from "./i18n/ar";
import { CoreTranslationService } from "@core/services/translation.service";

@Component({
  selector: "app-system-and-server",
  templateUrl: "./system-and-server.component.html",
  styleUrls: ["./system-and-server.component.scss"],
})
export class SystemAndServerComponent implements OnInit {
  constructor(private _coreTranslationService: CoreTranslationService) {
    this._coreTranslationService.translate(english, arabic);
  }

  ngOnInit(): void {}
}
