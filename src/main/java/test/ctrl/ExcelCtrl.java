/**
 * mazq
 * 2018年1月5日
 */
package test.ctrl;


import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import test.service.ITestService;
import test.vo.Goods;

/**
* Description: 
* Company:忧启  
* @author  mazq
* @date 2018年1月5日
*/
@Controller
@RequestMapping("excel")
public class ExcelCtrl {
	@Autowired
	ITestService testService;
	private Logger logger = Logger.getLogger(this.getClass());
	@ResponseBody
	@RequestMapping("list")
	public String  get(){
		List<Goods> list =  testService.getList();
		String str="";
		logger.info("@@@@@@@@@@@@");
		for(Goods goods:list){
		    str+=goods.getId();
		    str+=goods.getName();
		    str+=goods.getKeyword();
		}
		return str;
	}
	
	@ResponseBody
	@RequestMapping("str")
	public String  str(){

		return "sss";
	}
	@ResponseBody
	@RequestMapping("model")
	public ModelAndView  model(){
		return   new ModelAndView("../index");
	}
}
