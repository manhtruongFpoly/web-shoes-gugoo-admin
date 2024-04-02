import { data } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Chart, registerables } from 'chart.js';
import { DatePipe } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import * as Chartist from 'chartist';
import { Statistical, StatisticalByDay, StatisticalByMonth } from 'src/app/_model/Statistical';
import { StatisticalService } from 'src/app/_service/Statistical/statistical.service';
import { SessionStorageService } from 'src/app/_service/session-service/session-storage.service';
@Component({
  selector: 'app-statistical',
  templateUrl: './statistical.component.html',
  styleUrls: ['./statistical.component.css']
})
export class StatisticalComponent implements OnInit {

  formYear = this.fb.group({
    year: 2023
  });
  today = new Date();
  formMonthYear = this.fb.group({
    year: 2023,
    month: 2
  });



  statisticalDates!: StatisticalByDay[];
  statisticalDatesTable!: StatisticalByDay[];
  listDataDate!: MatTableDataSource<StatisticalByDay>;
  lengthDate!: number;
  columnsDate: string[] = ['index', 'totalOrder', 'totalMoney'];
  columnsTopProduct: string[] = ['index', 'code', 'name', 'quantity', 'total'];

  statisticalMonths!: StatisticalByMonth[];
  statisticalMonthsTable!: Statistical[];
  listDataMonth!: MatTableDataSource<Statistical>;
  lengthMonth!: number;
  columnsMonth: string[] = ['index', 'year', 'totalOrder', 'totalMoney'];

  statisticalYearsTable!: Statistical[];
  listDataYear!: any

  doanhthuhomnay!: any;
  tongdonthanhconghomnay!: any;
  lengthYears!: number;
  columnsYears: string[] = ['index', 'year', 'totalOrder', 'totalMoney'];
  statisticalYear!: Statistical[];

  totalMoneyAndOrderByYear: any[] = [];
  labelTotalMoneyOrder: any[] = [];
  dataTotalMoney: any[] = [];
  dataTotalOrder: any[] = [];

  monthByYear: any[] = [];
  labelMonthByYear: any[] = [];
  dataMoneyMonthByYear: any[] = [];
  dataOrderMonthByYear: any[] = [];

  monthYear: any[] = [];
  labelMonthYear: any[] = [];
  dataMoneyMonthYear: any[] = [];
  dataOrderMonthYear: any[] = [];


  thongKeTuTruocToiNay = {
    totalOrder: null,
    totalMoney: null
  };

  topProduct: any[] = [];
  labelsTopProduct:  any[] = [];
  dataTopProduct:  any[] = [];

  @ViewChild('sortMonth') sortMonth!: MatSort;
  @ViewChild('MatPaginatorMonth') paginatorMonth!: MatPaginator;
  @ViewChild('sortDate') sortDate!: MatSort;
  @ViewChild('MatPaginatorDate') paginatorDate!: MatPaginator;
  @ViewChild('sortYear') sortYear!: MatSort;
  @ViewChild('MatPaginatorYear') paginatorYear!: MatPaginator;


  labelsDate: any[] = [];
  labelsProduct: any[] = [];
  dataDate: number[] = [];

  labelsMonth: any[] = [];
  dataMonth: number[] = [];

  labelsYear: any[] = [];
  dataYear: number[] = [];

  myChartLine !: Chart;
  myChartBar !: Chart;
  myCharDoughnut !: Chart;

  chartIndex: any = 0;


  chart1!: Chart;
  chart2!: Chart;
  chart3!: Chart;
  chart4!: Chart;




  constructor(
    private datepipe: DatePipe, 
    private statisticalService: StatisticalService, 
    private toastr: ToastrService, 
    private sessionService: SessionStorageService,
    private fb: FormBuilder) { }

  ngOnInit(): void {

    Chart.register(...registerables);
    // this.getStatisticalAllDate();
     this.getStatisticalMonth();
    this.getStatisticalYear();
    this.getdate();
    this.getStatisticalAllDate();
    this.getTopProduct();
    this.getTotalMoneyAndOrderByYear();
    this.getThongKeTuTruocToiNay();
    this.formYear.patchValue({year:this.today.getFullYear()});
    this.formMonthYear.patchValue({year:this.today.getFullYear()});
    this.formMonthYear.patchValue({month:this.today.getMonth()+1});
    this.getListHoaDonTungThangTheoNam();
    this.getListHoaDonTungNgayTheoThangVaNam();
  }





  getThongKeTuTruocToiNay(){
    this.statisticalService.getThongKeTuTruocToiNay().subscribe({
      next: res =>{
        // console.log(res);
        this.thongKeTuTruocToiNay = res.data;
        console.log(this.thongKeTuTruocToiNay);

      },
      error: e =>{
        console.log(e);

      }
    })
  }

  getListHoaDonTungThangTheoNam(){
    console.log(this.formYear.value.year);
    this.dataMoneyMonthByYear=[];
    this.dataOrderMonthByYear=[];
    this.labelMonthByYear=[];
    this.statisticalService.getListHoaDonTungThangTheoNam(this.formYear.value.year).subscribe(
      res=>{
        console.log(res);
        this.monthByYear = res.data;
        this.monthByYear.forEach(item =>{
          this.dataMoneyMonthByYear.push(item.totalMoney);
          this.dataOrderMonthByYear.push(item.totalOrder);
          this.labelMonthByYear.push(item.month);
        });
        this.loadChartLineMonthByYear();
      }
    )
  }

  getListHoaDonTungNgayTheoThangVaNam(){
    this.dataMoneyMonthYear=[];
    this.dataOrderMonthYear=[];
    this.labelMonthYear=[];
    this.statisticalService.getListHoaDonTungNgayTheoThangVaNam(this.formMonthYear.value.month, this.formMonthYear.value.year).subscribe(
      res=>{
        console.log(res);
        this.monthYear = res.data;
        this.monthYear.forEach(item =>{
          this.dataMoneyMonthYear.push(item.totalMoney);
          this.dataOrderMonthYear.push(item.totalOrder);
          this.labelMonthYear.push(item.day);
        });
        this.loadChartLineMonthYear();
      }
    )
  }

  getTopProduct(){
    this.statisticalService.getTopProduct(10).subscribe(res=>{
      this.topProduct = res.data;
      this.topProduct.forEach(item => {
        this.dataTopProduct.push(item.quantity);
          this.labelsTopProduct.push(item.code);
      })
      this.loadChartLineTopProduct();
    })
  }

  getTotalMoneyAndOrderByYear(){
    this.statisticalService.getall().subscribe(res=>{
      this.totalMoneyAndOrderByYear = res.data;
      this.totalMoneyAndOrderByYear.forEach(item =>{
        this.dataTotalMoney.push(item.totalMoney);
        this.dataTotalOrder.push(item.totalOrder);
        this.labelTotalMoneyOrder.push(item.year);
      })
      this.loadChartLineTotalMoneyOrder();
    })
  }

  getStatisticalAllDate() {
    this.statisticalService.getDate().subscribe(data => {
      console.log('data1', data);
      //chart
      this.statisticalDates = data.data as any;
      this.statisticalDates.forEach(item => {
        this.dataDate.push(item.totalMoney);
          this.labelsDate.push(this.datepipe.transform(new Date, 'dd/MM/yyyy'));
      })
      this.loadChartLineDate();

      //table
      this.statisticalDatesTable = this.statisticalDates;
      // this.statisticalDatesTable.sort((o1,o2) =>  {
      //   if(o1.date<o2.date) {
      //     return 1;
      //   }
      //   if(o1.date>o2.date) {
      //     return -1;
      //   }
      //   return 0;
      // });
      this.listDataDate = new MatTableDataSource(this.statisticalDatesTable);
      this.lengthDate = this.statisticalDatesTable.length;
      this.listDataDate.sort = this.sortDate;
      this.listDataDate.paginator = this.paginatorDate;
    }, error => {
      this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
    })
  }




  getStatisticalMonth() {
    this.statisticalService.getmonthyear().subscribe(data => {
      console.log('data', data);

      this.statisticalMonths = data.data as any;

      this.statisticalMonths.forEach(item => {
        this.dataMonth.push(item.totalMoney),
        this.labelsMonth.push(item.month+'/'+item.year);
      })
      this.loadChartLineMonth();

      //table
      this.statisticalMonthsTable = this.statisticalMonths;
      this.statisticalMonthsTable.sort((o1,o2) =>  {
        if(o1.year<o2.year) {
          return 1;
        }
        if(o1.year>o2.year) {
          return -1;
        }
        return 0;
      });
      this.listDataMonth = new MatTableDataSource(this.statisticalMonthsTable);
      this.lengthMonth = this.statisticalMonthsTable.length;
      this.listDataMonth.sort = this.sortMonth;
      this.listDataMonth.paginator = this.paginatorMonth;
    })
  };






  getStatisticalYear() {
    this.statisticalService.getall().subscribe(data => {
      console.log('dảa', data);


      this.statisticalYear = data.data;
      this.listDataYear = new MatTableDataSource(this.statisticalYear);
      this.lengthYears = this.statisticalYear.length;
      this.listDataYear.sort = this.sortYear;
      this.listDataYear.paginator = this.paginatorYear;
      this.statisticalYear.forEach(item => {
        this.dataYear.push(item.totalMoney);
        this.labelsYear.push('Năm ' + (item.year));
      })
      this.loadChartDoughnutYear();
    })
  }
  getdate(){
    this.statisticalService.getDate().subscribe(data => {
      this.doanhthuhomnay=data.data[0].totalMoney;
      this.tongdonthanhconghomnay=data.data[0].totalOrder;

    })
  }
  loadChartLineMonthByYear() {

      if (this.chart1) {
        this.chart1.destroy();
        console.log(this.chart1);
      }
      if (this.chart2) {
        this.chart2.destroy();
        console.log(this.chart2);

      }

      this.chart1 = new Chart('chartMonthByYearMoney', {
        type: 'bar',
        data: {
          labels: this.labelMonthByYear,
          datasets: [{
            // label: '# of Votes',
            data: this.dataMoneyMonthByYear,
            // borderColor: 'rgb(75, 192, 192)',
            // pointBorderColor: 'rgba(54, 162, 235, 0.2)',
            // backgroundColor: 'rgba(255, 99, 132, 0.2)',
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(201, 203, 207, 0.2)',
              'rgba(0, 162, 71, 0.2)',
              'rgba(82, 0, 36, 0.2)',
              'rgba(82, 164, 36, 0.2)',
              'rgba(255, 158, 146, 0.2)',
              'rgba(123, 39, 56, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(201, 203, 207, 1)',
              'rgba(0, 162, 71, 1)',
              'rgba(82, 0, 36, 1)',
              'rgba(82, 164, 36, 1)',
              'rgba(255, 158, 146, 1)',
              'rgba(123, 39, 56, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });

      this.chart2 = new Chart('chartMonthByYearOrder', {
        type: 'bar',
        data: {
          labels: this.labelMonthByYear,
          datasets: [{
            // label: '# of Votes',
            data: this.dataOrderMonthByYear,
            // borderColor: 'rgb(75, 192, 192)',
            // pointBorderColor: 'rgba(54, 162, 235, 0.2)',
            // backgroundColor: 'rgba(255, 99, 132, 0.2)',
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(201, 203, 207, 0.2)',
              'rgba(0, 162, 71, 0.2)',
              'rgba(82, 0, 36, 0.2)',
              'rgba(82, 164, 36, 0.2)',
              'rgba(255, 158, 146, 0.2)',
              'rgba(123, 39, 56, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(201, 203, 207, 1)',
              'rgba(0, 162, 71, 1)',
              'rgba(82, 0, 36, 1)',
              'rgba(82, 164, 36, 1)',
              'rgba(255, 158, 146, 1)',
              'rgba(123, 39, 56, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });

    // this.myChartBar.destroy()
  }

  // loadChartLineMonthByYear() {
  //   this.myChartBar = new Chart('chartMonthByYearMoney', {
  //     type: 'bar',
  //     data: {
  //       labels: this.labelMonthByYear,
  //       datasets: [{
  //         // label: '# of Votes',
  //         data: this.dataMoneyMonthByYear,
  //         // borderColor: 'rgb(75, 192, 192)',
  //         // pointBorderColor: 'rgba(54, 162, 235, 0.2)',
  //         // backgroundColor: 'rgba(255, 99, 132, 0.2)',
  //         backgroundColor: [
  //           'rgba(255, 99, 132, 0.2)',
  //           'rgba(54, 162, 235, 0.2)',
  //           'rgba(255, 206, 86, 0.2)',
  //           'rgba(75, 192, 192, 0.2)',
  //           'rgba(153, 102, 255, 0.2)',
  //           'rgba(255, 159, 64, 0.2)',
  //           'rgba(201, 203, 207, 0.2)',
  //           'rgba(0, 162, 71, 0.2)',
  //           'rgba(82, 0, 36, 0.2)',
  //           'rgba(82, 164, 36, 0.2)',
  //           'rgba(255, 158, 146, 0.2)',
  //           'rgba(123, 39, 56, 0.2)'
  //         ],
  //         borderColor: [
  //           'rgba(255, 99, 132, 1)',
  //           'rgba(54, 162, 235, 1)',
  //           'rgba(255, 206, 86, 1)',
  //           'rgba(75, 192, 192, 1)',
  //           'rgba(153, 102, 255, 1)',
  //           'rgba(255, 159, 64, 1)',
  //           'rgba(201, 203, 207, 1)',
  //           'rgba(0, 162, 71, 1)',
  //           'rgba(82, 0, 36, 1)',
  //           'rgba(82, 164, 36, 1)',
  //           'rgba(255, 158, 146, 1)',
  //           'rgba(123, 39, 56, 1)'
  //         ],
  //         borderWidth: 1
  //       }]
  //     },
  //     options: {
  //       scales: {
  //         y: {
  //           beginAtZero: true
  //         }
  //       },
  //       plugins: {
  //         legend: {
  //           display: false
  //         }
  //       }
  //     }
  //   });
  //   this.myChartBar = new Chart('chartMonthByYearOrder', {
  //     type: 'bar',
  //     data: {
  //       labels: this.labelMonthByYear,
  //       datasets: [{
  //         // label: '# of Votes',
  //         data: this.dataOrderMonthByYear,
  //         // borderColor: 'rgb(75, 192, 192)',
  //         // pointBorderColor: 'rgba(54, 162, 235, 0.2)',
  //         // backgroundColor: 'rgba(255, 99, 132, 0.2)',
  //         backgroundColor: [
  //           'rgba(255, 99, 132, 0.2)',
  //           'rgba(54, 162, 235, 0.2)',
  //           'rgba(255, 206, 86, 0.2)',
  //           'rgba(75, 192, 192, 0.2)',
  //           'rgba(153, 102, 255, 0.2)',
  //           'rgba(255, 159, 64, 0.2)',
  //           'rgba(201, 203, 207, 0.2)',
  //           'rgba(0, 162, 71, 0.2)',
  //           'rgba(82, 0, 36, 0.2)',
  //           'rgba(82, 164, 36, 0.2)',
  //           'rgba(255, 158, 146, 0.2)',
  //           'rgba(123, 39, 56, 0.2)'
  //         ],
  //         borderColor: [
  //           'rgba(255, 99, 132, 1)',
  //           'rgba(54, 162, 235, 1)',
  //           'rgba(255, 206, 86, 1)',
  //           'rgba(75, 192, 192, 1)',
  //           'rgba(153, 102, 255, 1)',
  //           'rgba(255, 159, 64, 1)',
  //           'rgba(201, 203, 207, 1)',
  //           'rgba(0, 162, 71, 1)',
  //           'rgba(82, 0, 36, 1)',
  //           'rgba(82, 164, 36, 1)',
  //           'rgba(255, 158, 146, 1)',
  //           'rgba(123, 39, 56, 1)'
  //         ],
  //         borderWidth: 1
  //       }]
  //     },
  //     options: {
  //       scales: {
  //         y: {
  //           beginAtZero: true
  //         }
  //       },
  //       plugins: {
  //         legend: {
  //           display: false
  //         }
  //       }
  //     }
  //   });
  // }

  loadChartLineMonthYear() {

    if (this.chart3) {
      this.chart3.destroy();
      console.log('chart3--------------');
      console.log(this.chart3);
    }
    if (this.chart4) {
      this.chart4.destroy();
      console.log('chart4--------------');
      console.log(this.chart4);

    }

    this.chart3 = new Chart('chartMonthYearMoney', {
      type: 'bar',
      data: {
        labels: this.labelMonthYear,
        datasets: [{
          // label: '# of Votes',
          data: this.dataMoneyMonthYear,
          // borderColor: 'rgb(75, 192, 192)',
          // pointBorderColor: 'rgba(54, 162, 235, 0.2)',
          // backgroundColor: 'rgba(255, 99, 132, 0.2)',
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(201, 203, 207, 0.2)',
            'rgba(0, 162, 71, 0.2)',
            'rgba(82, 0, 36, 0.2)',
            'rgba(82, 164, 36, 0.2)',
            'rgba(255, 158, 146, 0.2)',
            'rgba(123, 39, 56, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(201, 203, 207, 1)',
            'rgba(0, 162, 71, 1)',
            'rgba(82, 0, 36, 1)',
            'rgba(82, 164, 36, 1)',
            'rgba(255, 158, 146, 1)',
            'rgba(123, 39, 56, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
    this.chart4 = new Chart('chartMonthYearOrder', {
      type: 'bar',
      data: {
        labels: this.labelMonthYear,
        datasets: [{
          // label: '# of Votes',
          data: this.dataOrderMonthYear,
          // borderColor: 'rgb(75, 192, 192)',
          // pointBorderColor: 'rgba(54, 162, 235, 0.2)',
          // backgroundColor: 'rgba(255, 99, 132, 0.2)',
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(201, 203, 207, 0.2)',
            'rgba(0, 162, 71, 0.2)',
            'rgba(82, 0, 36, 0.2)',
            'rgba(82, 164, 36, 0.2)',
            'rgba(255, 158, 146, 0.2)',
            'rgba(123, 39, 56, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(201, 203, 207, 1)',
            'rgba(0, 162, 71, 1)',
            'rgba(82, 0, 36, 1)',
            'rgba(82, 164, 36, 1)',
            'rgba(255, 158, 146, 1)',
            'rgba(123, 39, 56, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  loadChartLineTotalMoneyOrder() {
    this.myChartBar = new Chart('chartTotalMoney', {
      type: 'bar',
      data: {
        labels: this.labelTotalMoneyOrder,
        datasets: [{
          // label: '# of Votes',
          data: this.dataTotalMoney,
          // borderColor: 'rgb(75, 192, 192)',
          // pointBorderColor: 'rgba(54, 162, 235, 0.2)',
          // backgroundColor: 'rgba(255, 99, 132, 0.2)',
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(201, 203, 207, 0.2)',
            'rgba(0, 162, 71, 0.2)',
            'rgba(82, 0, 36, 0.2)',
            'rgba(82, 164, 36, 0.2)',
            'rgba(255, 158, 146, 0.2)',
            'rgba(123, 39, 56, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(201, 203, 207, 1)',
            'rgba(0, 162, 71, 1)',
            'rgba(82, 0, 36, 1)',
            'rgba(82, 164, 36, 1)',
            'rgba(255, 158, 146, 1)',
            'rgba(123, 39, 56, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
    this.myChartBar = new Chart('chartTotalOrder', {
      type: 'bar',
      data: {
        labels: this.labelTotalMoneyOrder,
        datasets: [{
          // label: '# of Votes',
          data: this.dataTotalOrder,
          // borderColor: 'rgb(75, 192, 192)',
          // pointBorderColor: 'rgba(54, 162, 235, 0.2)',
          // backgroundColor: 'rgba(255, 99, 132, 0.2)',
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(201, 203, 207, 0.2)',
            'rgba(0, 162, 71, 0.2)',
            'rgba(82, 0, 36, 0.2)',
            'rgba(82, 164, 36, 0.2)',
            'rgba(255, 158, 146, 0.2)',
            'rgba(123, 39, 56, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(201, 203, 207, 1)',
            'rgba(0, 162, 71, 1)',
            'rgba(82, 0, 36, 1)',
            'rgba(82, 164, 36, 1)',
            'rgba(255, 158, 146, 1)',
            'rgba(123, 39, 56, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  loadChartLineTopProduct() {
    this.myChartBar = new Chart('chartTopProduct', {
      type: 'bar',
      data: {
        labels: this.labelsTopProduct,
        datasets: [{
          // label: '# of Votes',
          data: this.dataTopProduct,
          // borderColor: 'rgb(75, 192, 192)',
          // pointBorderColor: 'rgba(54, 162, 235, 0.2)',
          // backgroundColor: 'rgba(255, 99, 132, 0.2)',
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(201, 203, 207, 0.2)',
            'rgba(0, 162, 71, 0.2)',
            'rgba(82, 0, 36, 0.2)',
            'rgba(82, 164, 36, 0.2)',
            'rgba(255, 158, 146, 0.2)',
            'rgba(123, 39, 56, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(201, 203, 207, 1)',
            'rgba(0, 162, 71, 1)',
            'rgba(82, 0, 36, 1)',
            'rgba(82, 164, 36, 1)',
            'rgba(255, 158, 146, 1)',
            'rgba(123, 39, 56, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  loadChartLineDate() {
    this.myChartBar = new Chart('chart', {
      type: 'bar',
      data: {
        labels: this.labelsDate,
        datasets: [{
          // label: '# of Votes',
          data: this.dataDate,
          // borderColor: 'rgb(75, 192, 192)',
          // pointBorderColor: 'rgba(54, 162, 235, 0.2)',
          // backgroundColor: 'rgba(255, 99, 132, 0.2)',
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(201, 203, 207, 0.2)',
            'rgba(0, 162, 71, 0.2)',
            'rgba(82, 0, 36, 0.2)',
            'rgba(82, 164, 36, 0.2)',
            'rgba(255, 158, 146, 0.2)',
            'rgba(123, 39, 56, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(201, 203, 207, 1)',
            'rgba(0, 162, 71, 1)',
            'rgba(82, 0, 36, 1)',
            'rgba(82, 164, 36, 1)',
            'rgba(255, 158, 146, 1)',
            'rgba(123, 39, 56, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  loadChartLineMonth() {
    this.myChartBar = new Chart('chartMonth', {
      type: 'line',
      data: {
        labels: this.labelsMonth,
        datasets: [{
          // label: '# of Votes',
          data: this.dataMonth,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  loadChartDoughnutYear() {
    this.myChartBar = new Chart('chartYear', {
      type: 'pie',
      data: {
        labels: this.labelsYear,
        datasets: [{
          label: 'My First Dataset',
          data: this.dataYear,
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(43, 99, 71)',
            'rgb(43, 255, 222)',
            'rgb(43, 113, 222)',
            'rgb(43, 13, 222)'
          ],
          hoverOffset: 1
        }]
      },
    });
  }

}
