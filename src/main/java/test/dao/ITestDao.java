/**
 * mazq
 * 2018年1月5日
 */
package test.dao;

import java.util.List;

import org.mybatis.spring.annotation.MapperScan;

import test.vo.Goods;

/**
* Description: 
* Company:忧启  
* @author  mazq
* @date 2018年1月5日
*/
@MapperScan
public interface ITestDao {
	public List<Goods> goodsList();
}
