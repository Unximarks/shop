/**
 * mazq
 * 2018年1月7日
 */
package test.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import test.dao.ITestDao;
import test.service.ITestService;
import test.vo.Goods;

/**
* Description: 
* Company:忧启  
* @author  mazq
* @date 2018年1月7日
*/
@Service
public class TestService  implements ITestService{
	@Autowired
	ITestDao dao;
	@Override
	public List<Goods> getList() {
		return dao.goodsList();
	}

}
