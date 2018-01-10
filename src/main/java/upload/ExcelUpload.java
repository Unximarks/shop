package upload;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;  

  
/** 
 * 读取Excel 
 *  
 * @author  
 */  
public class ExcelUpload {  
   
    private Workbook wb;  
    private Sheet sheet;  
    private Row row;  
  
    public ExcelUpload(String filepath) {  
        if(filepath==null){  
            return;  
        }  
        String ext = filepath.substring(filepath.lastIndexOf("."));  
        try {  
            InputStream is = new FileInputStream(filepath);  
            if(".xls".equals(ext)){  
                wb = new HSSFWorkbook(is);  
            }else if(".xlsx".equals(ext)){  
                wb = new XSSFWorkbook(is);  
            }else{  
                wb=null;  
            }  
        } catch (FileNotFoundException e) {  
        } catch (IOException e) {  
        }  
    }  
     
      
    /** 
     * 读取Excel表格表头的内容 
     *  
     * @param InputStream 
     * @return String 表头内容的数组 
     * @author zengwendong 
     */  
    public String[] readExcelTitle() throws Exception{  
        if(wb==null){  
            throw new Exception("Workbook对象为空！");  
        }  
        sheet = wb.getSheetAt(2);  
        row = sheet.getRow(0);  
        // 标题总列数  
        int colNum = row.getPhysicalNumberOfCells();  
        System.out.println("colNum:" + colNum);  
        String[] title = new String[colNum];  
        for (int i = 0; i < colNum; i++) {  
            // title[i] = getStringCellValue(row.getCell((short) i));  
            title[i] = row.getCell(i).getCellFormula();  
        }  
        return title;  
    }  
  
    /** 
     * 读取Excel数据内容 
     *  
     * @param InputStream 
     * @return Map 包含单元格数据内容的Map对象 
     * @author zengwendong 
     */  
    public Map<Integer, Map<Integer,Object>> readExcelContent() throws Exception{  
        if(wb==null){  
            throw new Exception("Workbook对象为空！");  
        }  
        Map<Integer, Map<Integer,Object>> content = new HashMap<Integer, Map<Integer,Object>>();  
          
        sheet = wb.getSheetAt(0);  
        
        Sheet sh =wb.getSheetAt(3);  
        
        System.out.println(sh==sheet);
        // 得到总行数  
        int rowNum = sheet.getLastRowNum();  
        row = sheet.getRow(0);  
        int colNum = row.getPhysicalNumberOfCells();  
        // 正文内容应该从第二行开始,第一行为表头的标题  
        for (int i = 1; i <= rowNum; i++) {  
            row = sheet.getRow(i);  
            int j = 0;  
            Map<Integer,Object> cellValue = new HashMap<Integer, Object>();  
            while (j < colNum) {  
                Object obj = getCellFormatValue(row.getCell(j));  
                cellValue.put(j, obj);  
                j++;  
            }  
            content.put(i, cellValue);  
        }  
        return content;  
    }  
  
    /** 
     *  
     * 根据Cell类型设置数据 
     *  
     * @param cell 
     * @return 
     * @author zengwendong 
     */  
    private Object getCellFormatValue(Cell cell) {  
        Object cellvalue = "";  
        if (cell != null) {  
            // 判断当前Cell的Type  
            switch (cell.getCellType()) {  
            case Cell.CELL_TYPE_NUMERIC:// 如果当前Cell的Type为NUMERIC  
            case Cell.CELL_TYPE_FORMULA: {  
                // 判断当前的cell是否为Date             
                	Date d = cell.getDateCellValue();           	 
                	DateFormat formater = new SimpleDateFormat("yyyy-MM-dd");  
                    cellvalue = formater.format(d);             
                break;  
            }  
            case Cell.CELL_TYPE_STRING:// 如果当前Cell的Type为STRING  
                // 取得当前的Cell字符串  
                cellvalue = cell.getRichStringCellValue().getString();  
                break;  
            default:// 默认的Cell值  
                cellvalue = "";  
            }  
        } else {  
            cellvalue = "";  
        }  
        return cellvalue;  
    }  
  
    public static void main(String[] args) {  
        try {  
            String filepath = "D:/Program Files (x86)/Tencent/QQ/806118781/FileRecv/dmm.xlsx";  
            File f =new File(filepath);
            
            boolean a =   f.exists();
            
            
            ExcelUpload excelReader = new ExcelUpload(filepath);  

            Map<Integer, Map<Integer,Object>> map = excelReader.readExcelContent();  
            System.out.println("获得Excel表格的内容:");  
            for (int i = 1; i <= map.size(); i++) {  
                System.out.println(map.get(i));  
            }  
        } catch (FileNotFoundException e) {  
            System.out.println("未找到指定路径的文件!");  
            e.printStackTrace();  
        }catch (Exception e) {  
            e.printStackTrace();  
        }  
    }  
}  