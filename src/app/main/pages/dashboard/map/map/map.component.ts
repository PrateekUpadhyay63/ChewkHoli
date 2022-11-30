import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  Input,
  SimpleChanges,
  OnChanges,
  Renderer2,
  ContentChild,
  HostListener,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CoreTranslationService } from "@core/services/translation.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { environment } from "environments/environment";
import maplibregl, {
  Map,
  NavigationControl,
  Marker,
  LngLatBounds,
  LngLatBoundsLike,
  ControlPosition,
} from "maplibre-gl";
import { ToastrService } from "ngx-toastr";
import { FirebaseMessageService } from "../../services/firebase-message.service";
import { MapService } from "../map.service";
import {
  colorForPinDrop,
  pinDropData,
  pinDropVar,
} from "../pin-drop-interface";
import { locale as english } from "../i18n/en";
import { locale as arabic } from "../i18n/ar";
import moment from "moment";
import { io } from "socket.io-client";
import { Router } from "@angular/router";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"],
})
export class MapComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges
{
  map: Map | undefined;
  @ViewChild("map")
  private mapContainer!: ElementRef<HTMLElement>;
  @Input("memberLocation") memberLocation: any;
  public currentMaker = [];
  public locationDataOnClick: boolean = true;
  public addEditPinDrop: FormGroup;
  public submitted: boolean = false;
  @ViewChild("addEditPinDropModal") myTestComp;
  @ViewChild("pinDropDeleteModal") pinDropDeleteM;
  @Input('position') position: ControlPosition;
  public pinDropData: pinDropData;
  public canAddPinDrops: boolean = false;
  public canMovePinDrops: boolean = false;
  public isPinDropEdit: boolean = false;
  public selectMarkerId: number;
  public markerDeleteId: number;
  public pinDropDataGet = [];
  public checkAssignedColor: boolean = false;
  public isMapOnDashboard: boolean = false;
  public socketInstance: any;
  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private mapService: MapService,
    private messagingService: FirebaseMessageService,
    private _toastrService: ToastrService,
    private _coreTranslationService: CoreTranslationService,
    private router: Router
  ) {
    this.isMapOnDashboard = this.router.url.includes("/dashboard");
    this._coreTranslationService.translate(english, arabic);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.memberLocation.firstChange) {
      // remove markers
      if (this.currentMaker !== null) {
        for (var i = this.currentMaker.length - 1; i >= 0; i--) {
          this.currentMaker[i].remove();
        }
        this.removeLayer();
      }
      if (changes.memberLocation.currentValue)
        this.setMarker(changes.memberLocation.currentValue);
    }
    if (this.memberLocation != null) {
      if (this.memberLocation.isFromLocationMdoule)
        this.locationDataOnClick = false;
    }
  }

  ngOnInit(): void {
    setTimeout(() => {
      if (this.memberLocation != null) {
        this.setMarker(this.memberLocation);
      }
    }, 500);

    this.messagingService.onPinDropSwtichChange.subscribe((res: pinDropVar) => {
      if (res != null) {
        this.canAddPinDrops = res.addPinDrop;
        this.canMovePinDrops = res.movePinDrop;
      }
    });

    // Init Socket.io
    if (this.isMapOnDashboard) this.initSocket();
  }

  // add pin drop form Init.
  addEditPinDropForm() {
    this.addEditPinDrop = this.formBuilder.group({
      message: [""],
      longitude: ["", Validators.required],
      latitude: ["", Validators.required],
      colorPicker: ["#5a1832"],
    });
  }

  // convenience getter for easy access to form fields
  get pinDropFormControl() {
    return this.addEditPinDrop.controls;
  }

  // Add  modal Open
  addEditPinDropModalOpen() {
    this.addEditPinDropForm();
    this.modalService.open(this.myTestComp, {
      centered: true,
      backdrop: false,
      size: "lg",
      container: ".dashboard-group-chat",
      windowClass: "modal modal-primary",
    });
  }

  openPinDrop(LngLat) {
    if (this.locationDataOnClick && this.canAddPinDrops) {
      this.isPinDropEdit = false;
      this.addEditPinDropModalOpen();
      this.addEditPinDrop.patchValue({ longitude: LngLat.lng });
      this.addEditPinDrop.patchValue({ latitude: LngLat.lat });
    }
  }
  // on color select
  onColorSelect(eve) {
    this.checkAssignedColor = Object.values(colorForPinDrop).includes(eve);
  }

  // On Pin drop form submit
  getDataFoSubmit() {
    this.submitted = true;
    if (this.addEditPinDrop.invalid) return;
    this.pinDropData = {
      color: this.addEditPinDrop.value.colorPicker,
      longitude: `${this.addEditPinDrop.value.longitude}`,
      latitude: `${this.addEditPinDrop.value.latitude}`,
      group_id: +this.memberLocation.group_id,
    };
      this.pinDropData.message = this.addEditPinDrop.value.message || "";
    if (!this.checkAssignedColor) this.addEditPinDropSubmit(this.pinDropData);
    var element = <HTMLInputElement> document.getElementById("customSwitch1");
     element.checked = false;
    //  this.isPinDropEdit = false;
    this.canAddPinDrops = false;
    // console.log("check the variable: ", element.checked)
    //  window.location.reload();
    // console.log("gdfgfgdf : ",this.addEditPinDrop.value.message )
  }

  addEditPinDropSubmit(data) {
    if (!this.isPinDropEdit) {
      this.mapService.addPinDrop(data).subscribe(
        (res: any) => {
          if (res.success) {
            this._toastrService.success(res.message, "Success", {
              toastClass: "toast ngx-toastr",
              closeButton: true,
            });
            this.modalService.dismissAll();
            this.getLocationByGroup(+this.memberLocation.group_id);
          }
          // this.setMarkerForPinDropMessage(this.pinDropData);
        },
        (err) => {
          this._toastrService.error(err.error.message, "Error", {
            toastClass: "toast ngx-toastr",
            closeButton: true,
          });
        }
      );
    } else {
      this.mapService.updatePinDrop(this.selectMarkerId, data).subscribe(
        (res: any) => {
          if (res.success) {
            this._toastrService.success(res.message, "Success", {
              toastClass: "toast ngx-toastr",
              closeButton: true,
            });
            this.modalService.dismissAll();
            this.getLocationByGroup(+this.memberLocation.group_id);
          }
          // this.setMarkerForPinDropMessage(data);
        },
        (err) => {
          this._toastrService.error(err.error.message, "Error", {
            toastClass: "toast ngx-toastr",
            closeButton: true,
          });
        }
      );
    }
  }

  // get member location bt group id
  getLocationByGroup(id: number) {
    this.mapService.getMemberLocationById(id).subscribe((res: any) => {
      if (res.data) {
        this.map.remove();
        setTimeout(() => {
          this.loadMap();
          this.setMarker(res.data);
        }, 60);
      }
    });
  }
  // on Form cancel
  cancel() {
    this.submitted = false;
    this.modalService.dismissAll();
    this.addEditPinDrop.reset();
    if (this.isPinDropEdit) {
      this.getLocationByGroup(+this.memberLocation.group_id);
    }
  }

  setMarker(markerData) {
    // for member location's
    if (markerData.members != null) {
      markerData.members.forEach((ele) => {
        if (ele.latitude && ele.longitude) {
          let formatDate;
          if (ele.created_at) {
            const temp = ele.created_at.toString().replace(" ", "T");
            formatDate = new Date(temp);
          }
          this.setMarkerForMember(
            ele.longitude,
            ele.latitude,
            ele.name,
            ele.updated_at ? ele.updated_at : ele.created_at,
            ele.id
          );
        }
      });
      if (markerData.isFromLocationMdoule) {
        this.moveMapToSelectedLocation(
          this.getLatLngToMoveMarker(markerData.members)
        );
        this.drawRouteLine(this.getAllCordinate(markerData.members));
      }
    }
    // for ip camera
    if (markerData.IpStream != null) {
      markerData.IpStream.forEach((ele) => {
        if (ele.latitude && ele.longitude) {
          let formatDate;
          if (ele.created_at) {
            const temp = ele.created_at.toString().replace(" ", "T");
            formatDate = new Date(temp);
          }
          this.setMarkerForIPCamera(
            ele.name,
            ele.longitude,
            ele.latitude,
            ele.serial_number,
            ele.updated_at ?  ele.updated_at : ele.created_at
          );
        }
      });
      if (markerData.isFromLocationMdoule) {
        this.moveMapToSelectedLocation(
          this.getLatLngToMoveMarker(markerData.IpStream)
        );
      }
    }
    // for vehicles
    if (markerData.Vehicles != null) {
      markerData.Vehicles.forEach((ele) => {
        if (ele.latitude && ele.longitude) {
          let formatDate;
          if (ele.created_at) {
            const temp = ele.created_at.toString().replace(" ", "T");
            formatDate = new Date(temp);
          }
          this.setMarkerForVehicles(
            ele.name,
            ele.longitude,
            ele.latitude,
            ele.chassis_number,
            ele.updated_at ? ele.updated_at  : ele.created_at
          );
        }
      });
      if (markerData.isFromLocationMdoule) {
        this.moveMapToSelectedLocation(
          this.getLatLngToMoveMarker(markerData.Vehicles)
        );
        this.drawRouteLine(this.getAllCordinate(markerData.Vehicles));
      }
    }

    // for pin drops
    if (markerData.pinDrops != null) {
      this.pinDropDataGet = markerData.pinDrops;
      markerData.pinDrops.forEach((element) => {
        if (element.latitude && element.longitude) {
          // const temp = element.created_at.toString().replace(" ", "T");
          //  formatDate = new Date(temp);
           let date = element.updated_at ?  element.updated_at : element.created_at
           let formatDate = moment(date).format("DD/MM/yyyy HH:mm");
          this.setMarkerForPinDropMessage(element ,formatDate);
        }
      });
    }
  }

  ngAfterViewInit(): void {
    const initialState = { lng: 55.179316, lat: 25.0904477, zoom: 14 };
    this.map = new maplibregl.Map({
      container: this.mapContainer.nativeElement,
      style:
        // https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL'
        {
          version: 8,
          sources: {
            "raster-tiles": {
              type: "raster",
              tiles: [environment.mapStyleUrl],
              tileSize: 256,
            },
          },
          layers: [
            {
              id: "simple-tiles",
              type: "raster",
              source: "raster-tiles",
              minzoom: 0,
              maxzoom: 22,
            },
          ],
        },
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom,
      // attributionControl: false,   // remove copy write text from Map buttom.
    });

    let nav = new maplibregl.NavigationControl({});
    this.map.addControl(nav, this.position);
    this.map.on("click", (e) => {
      this.openPinDrop(e.lngLat); 
    });
  }

  // Load Map
  loadMap() {
    const initialState = { lng: 55.179316, lat: 25.0904477, zoom: 14 };
    this.map = new maplibregl.Map({
      container: this.mapContainer.nativeElement,
      style: {
        version: 8,
        sources: {
          "raster-tiles": {
            type: "raster",
            tiles: [environment.mapStyleUrl],
            tileSize: 256,
          },
        },
        layers: [
          {
            id: "simple-tiles",
            type: "raster",
            source: "raster-tiles",
            minzoom: 0,
            maxzoom: 22,
          },
        ],
      },
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom,
    });

    let nav = new maplibregl.NavigationControl({});
    this.map.addControl(nav, this.position);
    this.map.on("click", (e) => {
      this.openPinDrop(e.lngLat);
    });
  }
  // set marker for members
  setMarkerForMember(lat, lan, name, date, id) {
    let formatDate = moment(date).format("DD/MM/yyyy HH:mm");
    /* Custom marker code
    let memberIcon = document.createElement("div");
    memberIcon.classList.add("member-marker");
    let member = new Marker(memberIcon, {
      anchor: "top",
      offset: [0, 2],
    })
    */
    let member = new Marker({
      color: colorForPinDrop.memberColor,
    })
      .setLngLat([lat, lan])
      .setPopup(
        new maplibregl.Popup({ maxWidth: "260px" }).setHTML(
          `<span id="user-${139}" style=' margin: 10px;
          font-weight: 600;' > <b>Name :- </b> ${name}</span><br>
          <span style=' margin: 10px;
          font-weight: 600;' > <b>Date & Time :- </b> ${formatDate}</span>`
        )
      )
      .addTo(this.map);
    member._element.id = `${id}-${name}`;
    this.currentMaker.push(member);
  }

  // set marker for vehicles
  setMarkerForVehicles(name,lat, lan, chassis_number, date) {
    let formatDate = moment(date).format("DD/MM/yyyy HH:mm");
    /* custom marker code
    let vehickeIcon = document.createElement("div");
    vehickeIcon.classList.add("vehicle-marker");
    let vehicle = new Marker(vehickeIcon, {
      anchor: "top",
      offset: [0, 2],
    })
    */
    let vehicle = new Marker({
      color: colorForPinDrop.vehicleColor,
    })
      .setLngLat([lat, lan])
      .setPopup( 
        new maplibregl.Popup({ maxWidth: "260px" }).setHTML(
          `<span style= 'margin: 10px; font-weight: 600;'><b>Name :- </b> ${name} </span><br/>
          <span style=' margin: 10px;
          font-weight: 600;' > <b>Chassis No. :-</b> ${chassis_number}</span><br>
          <span  style=' margin: 10px;
          font-weight: 600;' > <b>Date & Time :- </b> ${formatDate}</span>`
        )
      )
      .addTo(this.map);
    vehicle._element.id = chassis_number;
    this.currentMaker.push(vehicle);
  }

  // set marker for ip camera
  setMarkerForIPCamera(name, lat, lan, serial_number, date) {
    let formatDate = moment(date).format("DD/MM/yyyy HH:mm");
    /** Custom marker code 
    let ipCameraIcon = document.createElement("div");
    ipCameraIcon.classList.add("ipcamera-marker");
    let ipCamera = new Marker(ipCameraIcon, {
      anchor: "top",
      offset: [0, 2],
    })
    */
    let ipCamera = new Marker({
      color: colorForPinDrop.ipCameraColor,
    })
    // <span id="user-${memberLocation.user_id}" style=' margin: 10px;
    //             font-weight: 600;' > <b>Name :- </b> ${user_name}</span>
      .setLngLat([lat, lan])
      .setPopup(
        new maplibregl.Popup({ maxWidth: "260px" }).setHTML(
          `<span style= 'margin: 10px; font-weight: 600;'><b>Name :- </b> ${name} </span><br/>
          <span style=' margin: 10px;
          font-weight: 600;' ><b> Serial No. :- </b>${serial_number}</span><br>
          <span  style=' margin: 10px;
          font-weight: 600;' > <b>Date & Time :- </b> ${formatDate}</span>`
        )
      )
      .addTo(this.map);
    this.currentMaker.push(ipCamera);
  }

  // set marker for pin drop message by member
  setMarkerForPinDropMessage(data: pinDropData, formatDate) {
    let pinDrop = new maplibregl.Marker({
      color: data.color,
      draggable: true,
    })
      .setLngLat([+data.longitude, +data.latitude])
      .addTo(this.map);
      pinDrop.setPopup(
        new maplibregl.Popup({ maxWidth: "300px" }).setHTML(
          `<p style=' margin: 10px;
            font-weight: 600; display: inline-block; width: 18rem; word-break: break-all;' > ${data.message}</p>
            <span  style=' margin: 10px;
          font-weight: 400;' > <b>Date & Time :- </b> ${formatDate}</span>       
            <button
            type="button"
            style="font-size:10px"
            class="btn btn-sm btn-danger"
            rippleEffect
            id="btn-click-${data.id}"
          >
            Delete Pin
          </button>
          `
        )
      );
    pinDrop.on("dragend", (e) => {
      var lngLat = e.target._lngLat;
      let d1 = pinDrop
        .getElement()
        .getElementsByTagName("g")[2]
        .getAttribute("fill");
      this.isPinDropEdit = true;
      if (this.memberLocation.pinDrops != null) {
        this.pinDropDataGet.forEach((element) => {
          if (d1 === element.color && this.canMovePinDrops) {
            this.addEditPinDropModalOpen();
            this.selectMarkerId = element.id;
            this.addEditPinDrop.patchValue({ longitude: lngLat.lng });
            this.addEditPinDrop.patchValue({ latitude: lngLat.lat });
            this.addEditPinDrop.patchValue({ colorPicker: d1 });
            if (element.message)
              this.addEditPinDrop.patchValue({ message: element.message });
          }
        });
      }
    });
    this.currentMaker.push(pinDrop);
  }

  // host listener for delete pn drop.
  @HostListener("click", ["$event"])
  onClick(event) {
    if (event.target.id != null && event.target.id.includes("btn-click")) {
      let id = event.target.id.split("-")[2];
      this.markerDeleteId = +id;
      this.deletePinDropModalOpen();
    }
  }

  // Delet modal open
  deletePinDropModalOpen() {
    this.modalService.open(this.pinDropDeleteM, {
      centered: true,
      backdrop: false,
      size: "sm",
      container: ".dashboard-group-chat",
      windowClass: "modal modal-primary",
    });
  }

  //delet pin drop
  deletePinDrop() {
    this.mapService.deletePinDrop(this.markerDeleteId).subscribe(
      (res: any) => {
        if (res.success) {
          this._toastrService.success(res.message, "Success", {
            toastClass: "toast ngx-toastr",
            closeButton: true,
          });
          this.modalService.dismissAll();
          this.getLocationByGroup(+this.memberLocation.group_id);
          this.markerDeleteId = null;
        }
        // this.setMarkerForPinDropMessage(this.pinDropData);
      },
      (err) => {
        this._toastrService.error(err.error.message, "Error", {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        });
      }
    );
  }
  // calculate 1st and last co-ordinate to move the map to that location
  getLatLngToMoveMarker(LatLangData) {
    let moveMapData: LngLatBoundsLike;
    if (LatLangData.length > 1) {
      moveMapData = [
        [LatLangData[0].longitude, LatLangData[0].latitude],
        [
          LatLangData[LatLangData.length - 1].longitude,
          LatLangData[LatLangData.length - 1].latitude,
        ],
      ];
    } else {
      moveMapData = [
        [LatLangData[0].longitude, LatLangData[0].latitude],
        [LatLangData[0].longitude, LatLangData[0].latitude],
      ];
    }
    return moveMapData;
  }

  // Get all the co-ordinate to draw line between marker
  getAllCordinate(LatLangData) {
    let moveMapData = [];
    if (LatLangData.length > 1) {
      LatLangData.forEach((element) => {
        moveMapData.push([+element.longitude, +element.latitude]);
      });
    }
    return moveMapData;
  }

  // move map to that marker
  moveMapToSelectedLocation(data) {
    this.map.fitBounds(data, {
      padding: { top: 10, bottom: 25, left: 15, right: 5 },
      maxZoom: 8,
    });
    // this.drawRouteLine();
  }

  // Line
  drawRouteLine(cordinateData) {
    let geojson = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            coordinates: cordinateData,
            type: "LineString",
          },
        },
      ],
    };

    setTimeout(() => {
      // 'line-gradient' can only be used with GeoJSON sources
      // and the source must have the 'lineMetrics' option set to true
      this.map.addSource("line", {
        type: "geojson",
        lineMetrics: true,
        data: geojson,
      });

      // the layer must be of type 'line'
      this.map.addLayer({
        type: "line",
        source: "line",
        id: "line",
        paint: {
          "line-color": "red",
          "line-width": 5,
          // 'line-gradient' must be specified using an expression
          // with the special 'line-progress' property
          "line-gradient": [
            "interpolate",
            ["linear"],
            ["line-progress"],
            1,
            "green",
          ],
        },
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
      });
    }, 500);
  }

  /**
   * Socket code
   */

  initSocket() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const socket = io(environment.socketUrl, {
      extraHeaders: {
        Authorization: currentUser.token,
      },
    });
    // Get socket instance. 
    this.socketInstance = socket;
    // Socket connect.
    socket.on("connect", () => {
      // On Member location receives.
      socket.on("add-member-location", (location) => {
        this.updateMemberMarker(location);
      });

      // On vehicle location updates in realtime.
      socket.on("add-vehicle-location", (vehicle_location) => {
        this.updateVehicleMarker(vehicle_location);
      });
      this._toastrService.success("Socket connected sucessfully.", "Success", {
        toastClass: "toast ngx-toastr",
        closeButton: true,
      });
      console.log("connected..", socket.id); // x8WIv7-mJelg7on_ALbx
    });

    // On socket discoonect.
    socket.on("disconnect", () => {
      // this._toastrService.error("Socket disconnected.", "Error", {
      //   toastClass: "toast ngx-toastr",
      //   closeButton: true,
      // });
      // console.log(socket.id); // undefined
    });
  }

  // Update member marker
  updateMemberMarker(member_location) {
    let memberLocation = JSON.parse(JSON.stringify(member_location));
    this.currentMaker.forEach((ele) => {
      let marker_id = ele._element.id.split("-")[0];
      let user_name = ele._element.id.split("-")[1];
      if (+marker_id == memberLocation.user_id) {
        let formatDate = moment(memberLocation.updatedAt).format(
          "DD/MM/yyyy HH:mm"
        );
        ele
          .setLngLat([memberLocation.longitude, memberLocation.latitude])
          .setPopup(
            new maplibregl.Popup({ maxWidth: "260px" }).setHTML(
              `<span id="user-${memberLocation.user_id}" style=' margin: 10px;
                font-weight: 600;' > <b>Name :- </b> ${user_name}</span><br>
                <span style=' margin: 10px;
                font-weight: 600;' > <b>Date & Time :- </b> ${formatDate}</span>`
            )
          );
      }
    });
  }

  // Update vehicle marker
  updateVehicleMarker(vehicle_location) {
    let vehicleLocation = JSON.parse(JSON.stringify(vehicle_location));
    this.currentMaker.forEach((ele) => {
      if (ele._element.id == vehicleLocation.chassis_number) {
        let formatDate = moment(vehicleLocation.updatedAt).format(
          "DD/MM/yyyy HH:mm:ss a"
        );
        ele
          .setLngLat([vehicleLocation.longitude, vehicleLocation.latitude])
          .setPopup(
            new maplibregl.Popup({ maxWidth: "260px" }).setHTML(
              `<span style=' margin: 10px;
                  font-weight: 600;' > <b>Chassis No. :-</b> ${vehicleLocation.chassis_number}</span><br>
                  <span  style=' margin: 10px;
                  font-weight: 600;' > <b>Date & Time :- </b> ${formatDate}</span>`
            )
          );
      }
    });
  }

  // Remove Line layer and Source
  removeLayer() {
    if (this.map.getLayer("line")) this.map.removeLayer("line");
    if (this.map.getSource("line")) this.map.removeSource("line");
  }

  ngOnDestroy(): void {
    this.map?.remove();
    this.messagingService.onPinDropSwtichChange.emit({
      addPinDrop: false,
      movePinDrop: false,
    });
    this.currentMaker = null; // empty the current maker array after component destroy.
    if (this.socketInstance) this.socketInstance.disconnect();
  }
}
