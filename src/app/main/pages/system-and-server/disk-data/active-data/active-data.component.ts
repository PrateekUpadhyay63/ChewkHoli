import { Component, OnInit, ViewChild } from "@angular/core";
import moment from "moment";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ChartComponent,
  ApexPlotOptions,
  ApexStroke,
} from "ng-apexcharts";
import { SystemServerManagementService } from "../../system-server.service";

export type GroupDataChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
};

export type GroupedChartOption = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
};
@Component({
  selector: "app-active-data",
  templateUrl: "./active-data.component.html",
  styleUrls: ["./active-data.component.scss"],
})
export class ActiveDataComponent implements OnInit {
  @ViewChild("groupDataChart") groupDataChart: ChartComponent;
  @ViewChild("userDataChart") userDataChart: ChartComponent;
  @ViewChild("activeCallAndStreaming") activeCallAndStreaming: ChartComponent;
  public activeCallAndStreamchartOptions: Partial<GroupedChartOption>;
  public groupChart: Partial<GroupDataChartOptions>;
  public userChart: Partial<GroupDataChartOptions>;
  public groupData: any;
  public userData: any;
  public activeCallStreamData: any;
  constructor(private systemServerSvc: SystemServerManagementService) {}
  ngOnInit(): void {
    this.getGroupData();
    this.getUserData();
    this.getCurrentCallStream();
    setTimeout(() => {
      this.onChartDataRefresh();
    }, 100);
  }

  //Draw Group Data Line chart
  groupDataDraw(data) {
    //Group data chart
    this.groupChart = {
      series: [
        {
          name: "Active Groups",
          data: data.columns,
        },
      ],
      chart: {
        toolbar: {
          show: false,
        },
        type: "bar",
        height: 400,
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: data.rows,
      },
    };
  }

  //Draw user Data Line chart
  userDataDraw(data) {
    //user data chart
    this.userChart = {
      series: [
        {
          name: "Active Users",
          data: data.columns,
        },
      ],
      chart: {
        toolbar: {
          show: false,
        },
        type: "bar",
        height: 400,
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: data.rows,
      },
    };
  }

  // Get Group Data
  getGroupData() {
    this.systemServerSvc.getActiveGroupData().subscribe((res: any) => {
      if (res.data) {
        this.groupData = res.data;
        this.groupDataDraw(this.groupData);
      }
    });
  }

  // Get User Data
  getUserData() {
    this.systemServerSvc.getActiveUserData().subscribe((res: any) => {
      if (res.data) {
        this.userData = res.data;
        this.userDataDraw(this.userData);
      }
    });
  }

  //Current Call and Stream Data
  getCurrentCallStream() {
    this.systemServerSvc.getCurrentCallAndStreaming().subscribe((res: any) => {
      if (res.data) {
        this.activeCallStreamData = res.data;
        this.currentCallStreamDraw(this.activeCallStreamData);
      }
    });
  }

  currentCallStreamDraw(data) {
    console.log("data", data, data.rows[0]);

    this.activeCallAndStreamchartOptions = {
      series: [
        {
          name: data.rows[0],
          data: [data.columns[0]],
        },
        {
          name: data.rows[1],
          data: [data.columns[1]],
        },
      ],
      chart: {
        toolbar: {
          show: false,
        },
        type: "bar",
        height: 400,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: {
            position: "top",
          },
        },
      },
      dataLabels: {
        enabled: true,
        offsetX: -6,
        style: {
          fontSize: "12px",
          colors: ["#fff"],
        },
      },
      stroke: {
        show: true,
        width: 1,
        colors: ["#fff"],
      },
      xaxis: {
        categories: [moment(new Date()).format("DD/MM/YYYY")],
      },
    };
  }

  // On chart data refresh
  onChartDataRefresh() {
    this.getGroupData();
    this.getUserData();
    this.getCurrentCallStream();
  }
}
