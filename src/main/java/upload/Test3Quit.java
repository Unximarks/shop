/**
 * mazq
 * 2017年12月28日
 */
package upload;

import java.util.ArrayList;
import java.util.List;

/**
* Description: 
* Company:忧启  
* @author  mazq
* @date 2017年12月28日
*/
public class Test3Quit {

	/**
	 * @param l 剩下小朋友List
	 * @param n 第n个开始报数
	 * @param m 数到m的人退出
	 * @return 最后一个小朋友的号码
	 */
	static int   play(List<Integer>list,int m,int n){
		
		int  s =list.size();
		if(s==1){
			return list.get(0);
		}else{
			n=n+m-1;
			while(n>=s){
				n=n-s;
			}
			System.out.println(list.remove(n)+"###n="+n);;
			return	play(list, 3, n);
		}
		
		
	}
	 
	public static void main(String[] args) {
		int n =7;
		
		List<Integer> l = new ArrayList<Integer>();
		for(int i=1; i<=n; i++){
			l.add(i);
		}
		
		
		System.out.println(play(l, 3, 0));
	}

}