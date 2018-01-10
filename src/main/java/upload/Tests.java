/**

 * mazq
 * 2018年1月8日
 */
package upload;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
* Description: 
* Company:忧启  
* @author  mazq
* @date 2018年1月8日
*/
public class Tests {
	public static void main(String[] args) throws ParseException {
		Date d =   new Date();
		long s =d.getTime();
		System.out.println(s);
		SimpleDateFormat sdf =new SimpleDateFormat("yyyy-MM-dd");
		Date lastDate = sdf.parse("2018-01-07");
		Date nowDate = sdf.parse("2018-01-08");
		System.out.println(lastDate.getTime()/24/60/60+"@@@@@@@"+nowDate.getTime()/24/60/60);
		long f =d.getTime()/1000/24/60/60 - lastDate.getTime()/1000/24/60/60 ;
		System.out.println(f+"dddd"+(int)f);
		
		
		
	}
}
