<script>
// @ts-nocheck
    import exceljs from 'exceljs';
    import file_saver from 'file-saver'
    import {Button} from "$lib/components/ui/button";
    import numbro from 'numbro';

    let {INCOME = 380160.00/0.1,
           RENT = 2000*12*1.16,
           SALARIES = 1500*4*1.36*12,
           DIRECT_COST = 170553.60/0.1,
           WORKFORCE = 87183.16,
           PRODUCTION_SOLID_FOAM = 432000,
           ASSETS_PURCHASE = 1130000,
    } = $props()

    console.log("INCOME",INCOME)

    const { Workbook } = exceljs;
    const { saveAs } = file_saver;

    const STEPS = $state(10);

    const steps = $derived(Array(STEPS + 1).fill(0)) // n-1 Years

    let rows = $state([])

    function recalculate(){
      steps.forEach(
      (item,index)=>{
        if(index===0){
          steps[index] = {header: "Year", key: "names"};
        }else {
          steps[index]= {header: index, key: `Year${index}`};
        }
      }
    )



    rows.push(
      ["Production capacity used",
      ...Array(STEPS).fill(1).map(
        (value,index)=> numbro((index+1)/STEPS)
                        .format({output: "percent", mantissa: 2})
      )],
      ["Income",
      ...Array(STEPS).fill(1).map(
        (value,index)=> INCOME*(index+1)/STEPS
                        
      )],
      Array(STEPS+1),
      ["Fixed Cost",
      ...Array(STEPS).fill(1).map(
        (value,index)=> index+1
      )],
      ["Rent",
      ...Array(STEPS).fill(1).map(
        (value,index)=> RENT
      )],
      ["Salaries",
      ...Array(STEPS).fill(1).map(
        (value,index)=> SALARIES
      )],
      ["Total",
      ...Array(STEPS).fill(1).map(
        (value,index)=> SALARIES+RENT
      )],
      Array(STEPS+1),
      ["Variable Cost",
      ...Array(STEPS).fill(1).map(
        (value,index)=> index+1
      )],
      ["Direct Cost",
      ...Array(STEPS).fill(1).map(
        (value,index)=> DIRECT_COST*(index+1)/STEPS
      )],
      ["Workforce",
      ...Array(STEPS).fill(1).map(
        (value,index)=> WORKFORCE
      )],
      ["Comissions 4%",
      ...Array(STEPS).fill(1).map(
        (value,index)=> INCOME*0.04*(index+1)/STEPS
      )],
      ["Logistics 6%",
      ...Array(STEPS).fill(1).map(
        (value,index)=> 0.06*DIRECT_COST*(index+1)/STEPS
      )],
      ["Services",
      ...Array(STEPS).fill(1).map(
        (value,index)=> 1.03*PRODUCTION_SOLID_FOAM*(index+1)/STEPS
      )],
      ["Total",
      ...Array(STEPS).fill(1).map(
        (value,index)=> DIRECT_COST*(index+1)/STEPS+
                        WORKFORCE+
                        INCOME*0.04*(index+1)/STEPS+
                        0.06*DIRECT_COST*(index+1)/STEPS+
                        1.03*PRODUCTION_SOLID_FOAM*(index+1)/STEPS
      )],
      ["Fixed assets purchase",
      ...Array(1).fill(1).map(
        (value,index)=> ASSETS_PURCHASE
      )],
      ["Depreciation",
      ...Array(STEPS).fill(1).map(
        (value,index)=> ASSETS_PURCHASE*0.1
      )],
    
    )
    }

  
    
    
    const generateExcel = async () => {

      
      recalculate()
      let workbook = new Workbook();

      let worksheet = workbook.addWorksheet(
        numbro(Math.random()).format({ mantissa: 4})
      );

      worksheet.columns = steps;


      rows.forEach(row => {
        worksheet.addRow(row);
      });
  

      let buffer = await workbook.xlsx.writeBuffer();

      let blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(blob, `bioplaster-${new Date().toISOString()}.xlsx`);

      buffer=null;
      blob=null;
      workbook=null;
      worksheet=null;
    };
  </script>
  
  <Button onclick={generateExcel} class="mx-auto">Download Excel</Button>
  