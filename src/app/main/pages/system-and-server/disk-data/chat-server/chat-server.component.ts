import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import {
  ApexNonAxisChartSeries,
  ApexChart,
  ApexResponsive,
  ChartComponent,
  ApexAxisChartSeries,
  ApexDataLabels,
  ApexGrid,
  ApexLegend,
  ApexMarkers,
  ApexStroke,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexYAxis,
} from "ng-apexcharts";
import { SystemServerManagementService } from "../../system-server.service";
import { typesOfServer } from "../server.model";

export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
};

export type LineChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};

@Component({
  selector: "app-chat-server",
  templateUrl: "./chat-server.component.html",
  styleUrls: ["./chat-server.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ChatServerComponent implements OnInit {
  public chatServerData: any;
  public statusData;
  public bandWidthData: any;

  @ViewChild("storageChart") storagePieChart: ChartComponent;
  @ViewChild("bandWidthLineChart") bandWidthLineChart: ChartComponent;
  @ViewChild("memoryChart") memoryChartC: ChartComponent;
  @ViewChild("cpuUsage") cpuUsageChart: ChartComponent;
  public cpuUsageCartOptions: Partial<PieChartOptions>;
  public memoryhartOptions: Partial<PieChartOptions>;
  public storageChartOptions: Partial<PieChartOptions>;
  public bandWidthchartOptions: Partial<LineChartOptions>;
  constructor(private systemServerSvc: SystemServerManagementService) {}

  ngOnInit(): void {
    this.showPieCharts();
    this.getBandWidth();
    this.onChartDataRefresh();
  }
  // show pie charts
  showPieCharts() {
    this.systemServerSvc
      .getServerData(typesOfServer.chatServer)
      .subscribe((res: any) => {
        if (res.data) {
          this.chatServerData = res.data;
          this.storageChart(this.chatServerData.serviceDrive[0]);
          this.getServerStatus(this.chatServerData.serviceStatus[0].status);
          this.memoryChart(this.chatServerData.serviceMemory[0]);
          this.cpuUsage(this.chatServerData.serviceCpu[0]);
        }
      });
  }
  // Refresh
  onChartDataRefresh() {
    this.getBandWidth();
    this.showPieCharts();
  }
  // Storage
  storageChart(data) {
    this.storageChartOptions = {
      series: data.data,
      chart: {
        width: 380,
        type: "pie",
      },
      legend: {
        show: true,
        position: "bottom",
        horizontalAlign: "center",
      },
      dataLabels: {
        enabled: true,
        formatter(value: any, opts: any): any {
          return opts.w.config.series[opts.seriesIndex] + "GB";
        },
      },
      labels: data.labels,
      responsive: [
        {
          breakpoint: 400,
          options: {
            chart: {
              width: 300,
            },
            legend: {
              position: "top",
              horizontalAlign: "right",
              // floating: true,
              // offsetY: 0,
              // offsetX: -5,
            },
          },
        },
      ],
    };
  }

  //CCPU usage
  cpuUsage(data) {
    this.cpuUsageCartOptions = {
      series: data.data,
      chart: {
        width: 380,
        type: "pie",
      },

      legend: {
        show: true,
        position: "bottom",
        horizontalAlign: "center",
      },
      dataLabels: {
        enabled: true,
        formatter(value: any, opts: any): any {
          return opts.w.config.series[opts.seriesIndex] + "GB";
        },
      },
      labels: data.labels,
      responsive: [
        {
          breakpoint: 400,
          options: {
            chart: {
              width: 300,
            },
            legend: {
              position: "top",
              horizontalAlign: "right",
              // floating: true,
              // offsetY: 0,
              // offsetX: -5,
            },
          },
        },
      ],
    };
  }

  //  Memory
  memoryChart(data) {
    this.memoryhartOptions = {
      series: data.data,
      chart: {
        width: 380,
        type: "pie",
      },
      legend: {
        show: true,
        position: "bottom",
        horizontalAlign: "center",
      },
      dataLabels: {
        enabled: true,
        formatter(value: any, opts: any): any {
          return opts.w.config.series[opts.seriesIndex] + "GB";
        },
      },
      labels: data.labels,
      responsive: [
        {
          breakpoint: 400,
          options: {
            chart: {
              width: 300,
            },
            legend: {
              position: "top",
              horizontalAlign: "right",
              // floating: true,
              // offsetY: 0,
              // offsetX: -5,
            },
          },
        },
      ],
    };
  }

  // Get status
  getServerStatus(data) {
    if (data.match("inactive"))
      return (this.statusData = { status: "In-active" });
    if (data.match("active")) return (this.statusData = { status: "Active" });
    else return (this.statusData = { status: "Not Reachable" });
  }

  // Get Band width
  getBandWidth() {
    this.systemServerSvc
      .getServerBandWidth(typesOfServer.chatServer)
      .subscribe((res: any) => {
        if (res.data) {
          this.bandWidthData = res.data;
          this.bandWithLineChart(this.bandWidthData);
        }
      });
  }

  // Draw band width
  bandWithLineChart(data) {
    let max = Math.max(Math.max(...data.rx_data), Math.max(...data.tx_data));
    let min = Math.min(Math.min(...data.rx_data), Math.min(...data.tx_data));
    this.bandWidthchartOptions = {
      series: [
        {
          name: "Received Bytes",
          data: data.rx_data,
        },
        {
          name: "Transmitted Bytes",
          data: data.tx_data,
        },
      ],
      chart: {
        height: 350,
        type: "line",
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 8,
          blur: 10,
          opacity: 0.2,
        },
        toolbar: {
          show: false,
        },
      },
      colors: ["#77B6EA", "#545454"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },
      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5,
        },
      },
      markers: {
        size: 0.5,
      },
      xaxis: {
        categories: data.columns,
        title: {
          text: "Time",
        },
      },
      yaxis: {
        title: {
          text: "Band Width",
        },
        min: min - 0.5,
        max: max + 0.5,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    };
  }
}
