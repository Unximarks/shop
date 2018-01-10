/**
 * mazq
 * 2017年12月28日
 */
package upload;

/**
* Description: 
* Company:忧启  
* @author  mazq
* @date 2017年12月28日
*/
public class test38 {
	public static void main(String[] args) {
		String s= "sdfsfsad";
		
		System.out.println(get(s));
	}
	
	public static String get(String s){
		if(s.length()==1){
			return s;
		}
		return get(s.substring(1,s.length()))+s.substring(0,1);
	}
}
