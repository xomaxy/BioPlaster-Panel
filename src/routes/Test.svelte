<script>
    import exceljs from 'exceljs';
    import file_saver from 'file-saver'
    import {Button} from "$lib/components/ui/button";

    const { Workbook } = exceljs;
    const { saveAs } = file_saver;
  
    // Sample data - replace this with your calculated variables
    const data = [
      { name: "John", age: 30, city: "New York" },
      { name: "Doe", age: 22, city: "Los Angeles" }
    ];
  
    const generateExcel = async () => {
      // Create a workbook
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet("My Sheet");
  
      // Add a row for headers
      worksheet.addRow(["Name", "Age", "City"]);
  
      // Add data rows
      data.forEach(d => {
        worksheet.addRow([d.name, d.age, d.city]);
      });
  
      // Use exceljs to create Excel buffer
      const buffer = await workbook.xlsx.writeBuffer();
  
      // Use file-saver to save the file
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(blob, "MyData.xlsx");
    };
  </script>
  
  <Button on:click={generateExcel}>Download Excel</Button>
  